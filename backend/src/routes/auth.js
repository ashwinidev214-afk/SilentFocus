"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const crypto_1 = __importDefault(require("crypto"));
const db_1 = require("../utils/db");
const auth_1 = require("../middleware/auth");
const router = (0, express_1.Router)();
const JWT_SECRET = process.env.JWT_SECRET || 'supersecretchangeit';
// Helper to generate JWT
const generateToken = (user) => {
    return jsonwebtoken_1.default.sign({ id: user.id, email: user.email, role: user.role }, JWT_SECRET, { expiresIn: '24h' });
};
// 1. POST /api/auth/register
router.post('/register', async (req, res) => {
    const { email, password, first_name, last_name } = req.body;
    if (!email || !password || !first_name || !last_name) {
        return res.status(400).json({ error: 'Missing required fields' });
    }
    try {
        // Check if user exists
        const existingUsers = (0, db_1.query)(`SELECT * FROM users WHERE email = '${(0, db_1.escape)(email)}'`);
        if (existingUsers.length > 0) {
            return res.status(400).json({ error: 'User already exists' });
        }
        const userId = crypto_1.default.randomUUID();
        const passwordHash = await bcryptjs_1.default.hash(password, 10);
        // Insert user
        (0, db_1.query)(`INSERT INTO users (id, email, first_name, last_name, role) VALUES ('${userId}', '${(0, db_1.escape)(email)}', '${(0, db_1.escape)(first_name)}', '${(0, db_1.escape)(last_name)}', 'user')`);
        // Insert auth
        (0, db_1.query)(`INSERT INTO user_auth (id, user_id, provider, provider_id, password_hash) VALUES ('${crypto_1.default.randomUUID()}', '${userId}', 'email', '${(0, db_1.escape)(email)}', '${passwordHash}')`);
        const token = generateToken({ id: userId, email, role: 'user' });
        res.status(201).json({
            token,
            user: {
                id: userId,
                email,
                first_name,
                last_name,
                role: 'user'
            }
        });
    }
    catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});
// 2. POST /api/auth/login
router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).json({ error: 'Email and password are required' });
    }
    try {
        const users = (0, db_1.query)(`SELECT u.*, ua.password_hash FROM users u JOIN user_auth ua ON u.id = ua.user_id WHERE u.email = '${(0, db_1.escape)(email)}' AND ua.provider = 'email'`);
        if (users.length === 0) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }
        const user = users[0];
        const isPasswordValid = await bcryptjs_1.default.compare(password, user.password_hash);
        if (!isPasswordValid) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }
        const token = generateToken({ id: user.id, email: user.email, role: user.role });
        res.json({
            token,
            user: {
                id: user.id,
                email: user.email,
                first_name: user.first_name,
                last_name: user.last_name,
                role: user.role
            }
        });
    }
    catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});
// 3. POST /api/auth/forgot-password
router.post('/forgot-password', async (req, res) => {
    const { email } = req.body;
    if (!email) {
        return res.status(400).json({ error: 'Email is required' });
    }
    try {
        const users = (0, db_1.query)(`SELECT * FROM users WHERE email = '${(0, db_1.escape)(email)}'`);
        if (users.length === 0) {
            // Don't reveal if user exists for security, but we'll return success anyway
            return res.json({ message: 'If an account exists with this email, an OTP has been sent' });
        }
        const user = users[0];
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        const expiresAt = new Date(Date.now() + 15 * 60 * 1000).toISOString(); // 15 mins
        (0, db_1.query)(`INSERT INTO otp_verifications (id, user_id, type, code, expires_at) VALUES ('${crypto_1.default.randomUUID()}', '${user.id}', 'password_reset', '${otp}', '${expiresAt}')`);
        // In a real app, send email here. For now, we just return success.
        console.log(`OTP for ${email}: ${otp}`);
        res.json({ message: 'If an account exists with this email, an OTP has been sent' });
    }
    catch (error) {
        console.error('Forgot password error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});
// 4. POST /api/auth/verify-otp
router.post('/verify-otp', async (req, res) => {
    const { email, otp } = req.body;
    if (!email || !otp) {
        return res.status(400).json({ error: 'Email and OTP are required' });
    }
    try {
        const users = (0, db_1.query)(`SELECT * FROM users WHERE email = '${(0, db_1.escape)(email)}'`);
        if (users.length === 0) {
            return res.status(400).json({ error: 'Invalid email or OTP' });
        }
        const user = users[0];
        const otps = (0, db_1.query)(`SELECT * FROM otp_verifications WHERE user_id = '${user.id}' AND code = '${(0, db_1.escape)(otp)}' AND type = 'password_reset' AND used_at IS NULL ORDER BY created_at DESC LIMIT 1`);
        if (otps.length === 0) {
            return res.status(400).json({ error: 'Invalid OTP' });
        }
        const otpData = otps[0];
        if (new Date(otpData.expires_at) < new Date()) {
            return res.status(400).json({ error: 'OTP expired' });
        }
        // Mark OTP as used
        (0, db_1.query)(`UPDATE otp_verifications SET used_at = CURRENT_TIMESTAMP WHERE id = '${otpData.id}'`);
        // Generate a temporary token for password reset
        const resetToken = jsonwebtoken_1.default.sign({ userId: user.id, type: 'password_reset' }, JWT_SECRET, { expiresIn: '15m' });
        res.json({ resetToken });
    }
    catch (error) {
        console.error('Verify OTP error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});
// 5. POST /api/auth/reset-password
router.post('/reset-password', async (req, res) => {
    const { resetToken, newPassword } = req.body;
    if (!resetToken || !newPassword) {
        return res.status(400).json({ error: 'Reset token and new password are required' });
    }
    try {
        const decoded = jsonwebtoken_1.default.verify(resetToken, JWT_SECRET);
        if (decoded.type !== 'password_reset') {
            return res.status(400).json({ error: 'Invalid reset token' });
        }
        const passwordHash = await bcryptjs_1.default.hash(newPassword, 10);
        (0, db_1.query)(`UPDATE user_auth SET password_hash = '${passwordHash}' WHERE user_id = '${decoded.userId}' AND provider = 'email'`);
        res.json({ message: 'Password reset successful' });
    }
    catch (error) {
        console.error('Reset password error:', error);
        res.status(400).json({ error: 'Invalid or expired reset token' });
    }
});
// 6. POST /api/auth/google
router.post('/google', async (req, res) => {
    const { idToken, email, first_name, last_name, googleId } = req.body;
    if (!email || !googleId) {
        return res.status(400).json({ error: 'Email and googleId are required' });
    }
    try {
        let user;
        const existingUsers = (0, db_1.query)(`SELECT * FROM users WHERE email = '${(0, db_1.escape)(email)}'`);
        if (existingUsers.length > 0) {
            user = existingUsers[0];
            // Check if google auth exists
            const googleAuth = (0, db_1.query)(`SELECT * FROM user_auth WHERE user_id = '${user.id}' AND provider = 'google'`);
            if (googleAuth.length === 0) {
                (0, db_1.query)(`INSERT INTO user_auth (id, user_id, provider, provider_id) VALUES ('${crypto_1.default.randomUUID()}', '${user.id}', 'google', '${(0, db_1.escape)(googleId)}')`);
            }
        }
        else {
            const userId = crypto_1.default.randomUUID();
            (0, db_1.query)(`INSERT INTO users (id, email, first_name, last_name, role) VALUES ('${userId}', '${(0, db_1.escape)(email)}', '${(0, db_1.escape)(first_name || '')}', '${(0, db_1.escape)(last_name || '')}', 'user')`);
            (0, db_1.query)(`INSERT INTO user_auth (id, user_id, provider, provider_id) VALUES ('${crypto_1.default.randomUUID()}', '${userId}', 'google', '${(0, db_1.escape)(googleId)}')`);
            user = { id: userId, email, role: 'user', first_name, last_name };
        }
        const token = generateToken({ id: user.id, email: user.email, role: user.role });
        res.json({ token, user });
    }
    catch (error) {
        console.error('Google auth error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});
// 7. POST /api/auth/apple
router.post('/apple', async (req, res) => {
    const { appleToken, email, first_name, last_name, appleId } = req.body;
    if (!email || !appleId) {
        return res.status(400).json({ error: 'Email and appleId are required' });
    }
    try {
        let user;
        const existingUsers = (0, db_1.query)(`SELECT * FROM users WHERE email = '${(0, db_1.escape)(email)}'`);
        if (existingUsers.length > 0) {
            user = existingUsers[0];
            const appleAuth = (0, db_1.query)(`SELECT * FROM user_auth WHERE user_id = '${user.id}' AND provider = 'apple'`);
            if (appleAuth.length === 0) {
                (0, db_1.query)(`INSERT INTO user_auth (id, user_id, provider, provider_id) VALUES ('${crypto_1.default.randomUUID()}', '${user.id}', 'apple', '${(0, db_1.escape)(appleId)}')`);
            }
        }
        else {
            const userId = crypto_1.default.randomUUID();
            (0, db_1.query)(`INSERT INTO users (id, email, first_name, last_name, role) VALUES ('${userId}', '${(0, db_1.escape)(email)}', '${(0, db_1.escape)(first_name || '')}', '${(0, db_1.escape)(last_name || '')}', 'user')`);
            (0, db_1.query)(`INSERT INTO user_auth (id, user_id, provider, provider_id) VALUES ('${crypto_1.default.randomUUID()}', '${userId}', 'apple', '${(0, db_1.escape)(appleId)}')`);
            user = { id: userId, email, role: 'user', first_name, last_name };
        }
        const token = generateToken({ id: user.id, email: user.email, role: user.role });
        res.json({ token, user });
    }
    catch (error) {
        console.error('Apple auth error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});
// 8. GET /api/auth/me
router.get('/me', auth_1.authenticateJWT, async (req, res) => {
    if (!req.user) {
        return res.status(401).json({ error: 'Not authenticated' });
    }
    try {
        const users = (0, db_1.query)(`SELECT id, email, first_name, last_name, role, profile_picture FROM users WHERE id = '${req.user.id}'`);
        if (users.length === 0) {
            return res.status(404).json({ error: 'User not found' });
        }
        res.json({ user: users[0] });
    }
    catch (error) {
        console.error('Get me error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});
exports.default = router;
//# sourceMappingURL=auth.js.map