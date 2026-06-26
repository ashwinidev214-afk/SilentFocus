import { execSync } from 'child_process';

export interface DbResult {
    [key: string]: any;
}

export const query = (sql: string): DbResult[] => {
    try {
        // Escape double quotes for shell
        const escapedSql = sql.replace(/"/g, '\\"');
        const command = `team-db "${escapedSql}"`;
        const output = execSync(command, { encoding: 'utf8' });
        
        if (!output || output.trim() === '') {
            return [];
        }
        
        try {
            return JSON.parse(output);
        } catch (e) {
            console.error('Failed to parse team-db output:', output);
            return [];
        }
    } catch (error: any) {
        console.error('Database query error:', error.message);
        throw error;
    }
};

export const execute = (sql: string): void => {
    query(sql);
};

export const escape = (str: string): string => {
    return str.replace(/'/g, "''");
};
