import sqlite3, { Database } from 'sqlite3';
import fs from 'fs';
const sqlite = sqlite3.verbose();

class DatabaseWrapper {
    private static _instance: DatabaseWrapper;
    private readonly dbPath = './database.db';

    private constructor() {
        if (!fs.existsSync(this.dbPath)) {
            this.createNewDbFile();
        }
    }

    private createNewDbFile() {
        fs.openSync(this.dbPath, 'w');

        const handleError = (err: Error) => {
            console.log(err.message);
        }

        const createTestSuites = `
            CREATE TABLE testsuites (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                name TEXT NOT NULL UNIQUE
            );
        `;
        const createTests = `
            CREATE TABLE tests (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                testsuitesId INTEGER,
                testType TEXT NOT NULL,
                params TEXT NOT NULL,
                FOREIGN KEY(testsuitesId) REFERENCES testsuites(id)
            );
        `;
        this.getDatabase()
            .run(createTestSuites, handleError)
            .run(createTests, handleError);
    }

    private getDatabase(): sqlite3.Database {
        return new sqlite.Database(this.dbPath, (err: Error | null) => {
            if (err) {
                console.error(err.message);
            }
            console.log('Connected to database.');
        });
    }

    public static getDatabase(): Database {
        if (!this._instance) {
            this._instance = new DatabaseWrapper();
        }
        return this._instance.getDatabase();
    }
}

export default DatabaseWrapper; 