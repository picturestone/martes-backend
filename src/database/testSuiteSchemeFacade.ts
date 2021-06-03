import { Database, RunResult } from 'sqlite3';
import DatabaseWrapper from './databaseWrapper';
import TestScheme from '../models/schemes/testScheme';
import TestSuiteScheme from "../models/schemes/testSuiteScheme";
import TestFactory from '../testFactory';

class TestSuiteSchemeFacade {
    public getById(id: number, callback: (err: Error | null, testSuiteScheme: TestSuiteScheme | null) => void) {
        DatabaseWrapper.getDatabase().then((db: Database) => {
            const sql = `SELECT * FROM testsuiteschemes as tss LEFT JOIN testschemes as ts ON tss.id = ts.testsuiteschemeId WHERE tss.id = ?`;
            db.all(sql, [id], (err: Error, rows: any[]) => {
                if (err) {
                    callback(err, null);
                } else {
                    if (rows.length === 0) {
                        callback(null, null);
                    } else {
                        const testSuiteScheme = new TestSuiteScheme(rows[0].name, rows[0].testsuiteschemeId);
                        const testSchemes: TestScheme<any>[] = [];
                        const testFactory: TestFactory = TestFactory.getInstance();
                        rows.forEach((row) => {
                            testSchemes.push(testFactory.getTestScheme(row.testType, JSON.parse(row.parameters), row.id));
                        });
                        testSuiteScheme.testSchemes = testSchemes;
                        callback(null, testSuiteScheme);
                    }
                }
            });
        });
    }

    public save(testSuiteScheme: TestSuiteScheme, callback: (err: Error | null, identifier: number) => void) {
        DatabaseWrapper.getDatabase().then((db: Database) => {
            const handleError = (err: Error) => {
                db.run('ROLLBACK');
                callback(err, 0);
            }
    
            // Start transaction - necessary because testsuite needs to be inserted first since the tests 
            // need the id of the testsuite as a foregin key.
            db.run('BEGIN');
            // Insert the testsuite.
            let sql = `INSERT INTO testsuiteschemes(name) VALUES(?)`;
            db.run(sql, [testSuiteScheme.name], function (this: RunResult, err: Error) {
                if (err) {
                    return handleError(err);
                } else {
                    // Insert all tests. Done with promises so callback is only called if all inserts are successful.
                    sql = `INSERT INTO testschemes(testsuiteschemeId, testType, parameters) VALUES(?, ?, ?)`;
                    const queries = testSuiteScheme.testSchemes.map((testScheme) => {
                        return new Promise<void>((resolve, reject) => {
                                db.run(sql, [this.lastID, testScheme.testType, JSON.stringify(testScheme.parameters)], (err: Error) => {
                                    if (err) {
                                        reject(err);
                                    } else {
                                        resolve();
                                    }
                                });
                            });
                    });
                    Promise.all(queries).then(() => {
                        db.run('COMMIT');
                        callback(null, this.lastID);
                    }, (err) => {
                        handleError(err);
                    });
                }
            });
        });
    }
}

export default TestSuiteSchemeFacade;