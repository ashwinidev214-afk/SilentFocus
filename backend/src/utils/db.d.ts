export interface DbResult {
    [key: string]: any;
}
export declare const query: (sql: string) => DbResult[];
export declare const execute: (sql: string) => void;
export declare const escape: (str: string) => string;
//# sourceMappingURL=db.d.ts.map