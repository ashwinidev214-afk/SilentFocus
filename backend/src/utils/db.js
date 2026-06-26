"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.escape = exports.execute = exports.query = void 0;
const child_process_1 = require("child_process");
const query = (sql) => {
    try {
        // Escape double quotes for shell
        const escapedSql = sql.replace(/"/g, '\\"');
        const command = `team-db "${escapedSql}"`;
        const output = (0, child_process_1.execSync)(command, { encoding: 'utf8' });
        if (!output || output.trim() === '') {
            return [];
        }
        try {
            return JSON.parse(output);
        }
        catch (e) {
            console.error('Failed to parse team-db output:', output);
            return [];
        }
    }
    catch (error) {
        console.error('Database query error:', error.message);
        throw error;
    }
};
exports.query = query;
const execute = (sql) => {
    (0, exports.query)(sql);
};
exports.execute = execute;
const escape = (str) => {
    return str.replace(/'/g, "''");
};
exports.escape = escape;
//# sourceMappingURL=db.js.map