const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const schemaPath = path.join(__dirname, 'schema.sql');
const schema = fs.readFileSync(schemaPath, 'utf8');

// Split by semicolon, but be careful with semicolons inside strings if any
// For this schema, simple split should work as there are no semicolons in content
const statements = schema
    .split(';')
    .map(s => s.trim())
    .filter(s => s.length > 0);

console.log(`Found ${statements.length} statements to execute.`);

statements.forEach((stmt, index) => {
    console.log(`Executing statement ${index + 1}...`);
    try {
        // Escape double quotes for the shell command
        const escapedStmt = stmt.replace(/"/g, '\\"');
        const command = `team-db "${escapedStmt}"`;
        const output = execSync(command, { encoding: 'utf8' });
        console.log(`Success: ${output.substring(0, 50)}...`);
    } catch (error) {
        console.error(`Error executing statement ${index + 1}:`);
        console.error(error.message);
        // We don't exit here to allow subsequent statements (like INSERT OR IGNORE) to run
    }
});

console.log('Database setup complete.');
