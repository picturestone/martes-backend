import sqlite3, { Database } from 'sqlite3';
import fs from 'fs';
const sqlite = sqlite3.verbose();

class DatabaseWrapper {
    private static _instance: DatabaseWrapper;
    private readonly dbPath = './database.db';

    private createNewDbFile(): Promise<void> {
        fs.openSync(this.dbPath, 'w');
        const db: Database = this.getDatabase();

        return new Promise<void>((resolve, reject) => {
            // Create testsuiteschemes table.
            const sql = `
                CREATE TABLE testsuiteschemes (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    name TEXT NOT NULL UNIQUE
                );
            `;
            db.run(sql, (err: Error) => {
                if (err) {
                    reject(err);
                } else {
                    resolve();
                }
            });
        }).then(() => {
            return new Promise<void>((resolve, reject) => {
                // Create testschemes table.
                const sql = `
                    CREATE TABLE testschemes (
                        id INTEGER PRIMARY KEY AUTOINCREMENT,
                        testsuiteschemeId INTEGER NOT NULL,
                        testType TEXT NOT NULL,
                        parameters TEXT NOT NULL,
                        FOREIGN KEY(testsuiteschemeId) REFERENCES testsuiteschemes(id) ON DELETE CASCADE
                    );
                `;
                db.run(sql, (err: Error) => {
                    if (err) {
                        reject(err);
                    } else {
                        resolve();
                    }
                });
            });
        }).then(() => {
            return new Promise<void>((resolve, reject) => {
                // Create testsuites table.
                const sql = `
                    CREATE TABLE testsuites (
                        id INTEGER PRIMARY KEY AUTOINCREMENT,
                        name TEXT NOT NULL
                    );
                `;
                db.run(sql, (err: Error) => {
                    if (err) {
                        reject(err);
                    } else {
                        resolve();
                    }
                });
            });
        }).then(() => {
            return new Promise<void>((resolve, reject) => {
                // Create tests table.
                const sql = `
                    CREATE TABLE tests (
                        id INTEGER PRIMARY KEY AUTOINCREMENT,
                        testsuiteId INTEGER NOT NULL,
                        testType TEXT NOT NULL,
                        parameters TEXT NOT NULL,
                        logMessages TEXT,
                        FOREIGN KEY(testsuiteId) REFERENCES testsuites(id) ON DELETE CASCADE
                    );
                `;
                db.run(sql, (err: Error) => {
                    if (err) {
                        reject(err);
                    } else {
                        resolve();
                    }
                });
            });
        });
    }

    private getDatabase(): sqlite3.Database {
        return new sqlite.Database(this.dbPath, (err: Error | null) => {
            if (err) {
                console.error(err.message);
            }
            console.log('Connected to database.');
        });
    }

    public static async getDatabase(): Promise<Database> {
        if (!this._instance) {
            this._instance = new DatabaseWrapper();
        }

        if (!fs.existsSync(this._instance.dbPath)) {
            try {
                await this._instance.createNewDbFile();
            } catch (error: any) {
                console.error(error.message);
            }
        }

        return this._instance.getDatabase();
    }
}

export default DatabaseWrapper; 