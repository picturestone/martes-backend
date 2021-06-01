import sqlite3, { Database } from 'sqlite3';
import fs from 'fs';
const sqlite = sqlite3.verbose();

class DatabaseWrapper {
    private static _instance: DatabaseWrapper;
    private readonly dbPath = './database.db';

    private createNewDbFile(): Promise<void> {
        fs.openSync(this.dbPath, 'w');

        const createTestSuites = `
            CREATE TABLE testsuiteschemes (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                name TEXT NOT NULL UNIQUE
            );
        `;
        const createTests = `
            CREATE TABLE testschemes (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                testsuiteschemeId INTEGER,
                testType TEXT NOT NULL,
                params TEXT NOT NULL,
                FOREIGN KEY(testsuiteschemeId) REFERENCES testsuiteschemes(id)
            );
        `;
        const db: Database = this.getDatabase();

        return new Promise((resolve, reject) => {
            db.run(createTestSuites, (err: Error) => {
                if (err) {
                    reject(err);
                } else {
                    db.run(createTests, (err: Error) => {
                        if (err) {
                            reject(err);
                        } else {
                            resolve();
                        }
                    });
                }
            })
        })
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
            } catch (error) {
                console.error(error.message);
            }
        }

        return this._instance.getDatabase();
    }
}

export default DatabaseWrapper; 