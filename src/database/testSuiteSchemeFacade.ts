import { Database, RunResult } from 'sqlite3';
import DatabaseWrapper from './databaseWrapper';
import TestScheme from '../models/schemes/testScheme';
import TestSuiteScheme from "../models/schemes/testSuiteScheme";
import TestFactory from '../testFactory';

class TestSuiteSchemeFacade {
    public getAll(callback: (err: Error | null, testSuiteSchemes: TestSuiteScheme[] | null) => void) {
        DatabaseWrapper.getDatabase().then((db: Database) => {
            const sql = `SELECT * FROM testsuiteschemes`;
            db.all(sql, (err: Error, rows: any[]) => {
                if (err) {
                    callback(err, null);
                } else {
                    const testSuiteSchemes: TestSuiteScheme[] = [];
                    rows.forEach((row) => {
                        testSuiteSchemes.push(new TestSuiteScheme(row.name, row.id));
                    });
                    callback(null, testSuiteSchemes);
                }
            });
        });
    }

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

    public delete(id: number, callback: (err: Error | null, identifier: number | null) => void) {
        // Check if entry with id exists.
        this.getById(id, (err: Error | null, oldTestSuiteScheme: TestSuiteScheme | null) => {
            if (err) {
                callback(err, null);
            } else if (oldTestSuiteScheme === null) {
                callback(null, null);
            } else {
                DatabaseWrapper.getDatabase().then((db: Database) => {
                    db.run(`PRAGMA foreign_keys = ON`, (err: Error) => {
                        if (err) {
                            callback(err, null);
                        } else {
                            const sql = `DELETE FROM testsuiteschemes WHERE id = ?`;
                            db.run(sql, [id], function (this: RunResult, err: Error) {
                                if (err) {
                                    callback(err, null);
                                } else {
                                    callback(null, this.lastID);
                                }
                            });
                        }
                    });
                });
            }
        });
    }

    public update(id: number, testSuiteScheme: TestSuiteScheme, callback: (err: Error | null, identifier: number | null) => void): void {
        // Check if entry with id exists.
        this.getById(id, (err: Error | null, oldTestSuiteScheme: TestSuiteScheme | null) => {
            if (err) {
                callback(err, null);
            } else if (oldTestSuiteScheme === null) {
                callback(null, null);
            } else {
                DatabaseWrapper.getDatabase().then((db) => {
                    const queries: Promise<void>[] = [];
                    db.run('BEGIN');
                    // Insert all tests. Done with promises so callback is only called if all inserts are successful.
                    const updateTestSuiteScheme = `UPDATE testsuiteschemes SET name = ? WHERE id = ?`;
                    queries.push(new Promise<void>((resolve, reject) => {
                        db.run(updateTestSuiteScheme, [testSuiteScheme.name, id], (err: Error) => {
                            if (err) {
                                reject(err);
                            } else {
                                resolve();
                            }
                        });
                    }));

                    testSuiteScheme.testSchemes.forEach((newTestScheme) => {
                        queries.push(new Promise<void>((resolve, reject) => {
                            if (newTestScheme.id) {
                                const indexInOldTestSuiteScheme = oldTestSuiteScheme.testSchemes.findIndex((oldTestScheme) => {
                                    return oldTestScheme.id === newTestScheme.id;
                                });
                                if (-1 < indexInOldTestSuiteScheme) {
                                    // Test scheme found in old test schemes, so it must be updated. Remove the old scheme so its not removed afterwards.
                                    oldTestSuiteScheme.testSchemes.splice(indexInOldTestSuiteScheme, 1);
                                    const updateTestScheme: string = `UPDATE testschemes SET testType = ?, parameters = ? WHERE id = ?`;
                                    db.run(updateTestScheme, [newTestScheme.testType, JSON.stringify(newTestScheme.parameters), newTestScheme.id], (err: Error) => {
                                        if (err) {
                                            reject(err);
                                        } else {
                                            resolve();
                                        }
                                    });
                                } else {
                                    // New test scheme has an ID that is not found in the old test schemes. The caller probably set the ID themselves, so this is an error.
                                    reject(new Error(`Test Scheme with id ${newTestScheme.id} is not found in test suite scheme with id ${id}`));
                                }
                            } else {
                                // Test scheme does not have an id yet, so add it to the database.
                                const addTestScheme = `INSERT INTO testschemes(testsuiteschemeId, testType, parameters) VALUES(?, ?, ?)`;
                                db.run(addTestScheme, [testSuiteScheme.id, newTestScheme.testType, JSON.stringify(newTestScheme.parameters)], (err: Error) => {
                                    if (err) {
                                        reject(err);
                                    } else {
                                        resolve();
                                    }
                                });
                            }
                        }));
                    });

                    // Remove all test schemes of the old test suite scheme that are not in the new test suite scheme.
                    oldTestSuiteScheme.testSchemes.forEach((oldTestScheme) => {
                        queries.push(new Promise<void>((resolve, reject) => {
                            const deleteTestScheme = `DELETE FROM testschemes WHERE id = ?`;
                            db.run(deleteTestScheme, [oldTestScheme.id], (err: Error) => {
                                if (err) {
                                    reject(err);
                                } else {
                                    resolve();
                                }
                            });
                        }));
                    });
                    
                    // After all queries execute, commit the transaction.
                    Promise.all(queries).then(() => {
                        db.run('COMMIT');
                        callback(null, id);
                    }, (err) => {
                        db.run('ROLLBACK');
                        callback(err, null);
                    });
                });
            }
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