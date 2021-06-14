import { Database, RunResult } from 'sqlite3';
import DatabaseWrapper from './databaseWrapper';
import TestFactory from '../testFactory';
import TestSuite from '../models/executable/testSuite';
import Executable from '../models/executable/executableTest';
import ExecutableTest from '../models/executable/executableTest';

class TestSuiteFacade {
    public getAll(callback: (err: Error | null, testSuites: TestSuite[] | null) => void) {
        DatabaseWrapper.getDatabase().then((db: Database) => {
            const sql = `SELECT * FROM testsuites`;
            db.all(sql, (err: Error, rows: any[]) => {
                if (err) {
                    callback(err, null);
                } else {
                    const testSuites: TestSuite[] = [];
                    rows.forEach((row) => {
                        testSuites.push(new TestSuite(row.name, row.id));
                    });
                    callback(null, testSuites);
                }
            });
        });
    }

    public getById(id: number, callback: (err: Error | null, testSuite: TestSuite | null) => void) {
        DatabaseWrapper.getDatabase().then((db: Database) => {
            const sql = `SELECT * FROM testsuites as ts LEFT JOIN tests as t ON ts.id = t.testsuiteId WHERE ts.id = ?`;
            db.all(sql, [id], (err: Error, rows: any[]) => {
                if (err) {
                    callback(err, null);
                } else {
                    if (rows.length === 0) {
                        callback(null, null);
                    } else {
                        const testSuite = new TestSuite(rows[0].name, rows[0].testsuiteId);
                        const tests: Executable<any>[] = [];
                        const testFactory: TestFactory = TestFactory.getInstance();
                        rows.forEach((row) => {
                            const executableTest: ExecutableTest<any> = testFactory.getExecutableTest(row.testType, JSON.parse(row.parameters), row.id);
                            executableTest.logMessages = JSON.parse(row.logMessages);
                            tests.push(executableTest);
                        });
                        testSuite.tests = tests;
                        callback(null, testSuite);
                    }
                }
            });
        });
    }

    public delete(id: number, callback: (err: Error | null, identifier: number | null) => void) {
        // Check if entry with id exists.
        this.getById(id, (err: Error | null, oldTestSuite: TestSuite | null) => {
            if (err) {
                callback(err, null);
            } else if (oldTestSuite === null) {
                callback(null, null);
            } else {
                DatabaseWrapper.getDatabase().then((db: Database) => {
                    // Turn on foreign key support
                    db.run(`PRAGMA foreign_keys = ON`, (err: Error) => {
                        if (err) {
                            callback(err, null);
                        } else {
                            const sql = `DELETE FROM testsuites WHERE id = ?`;
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

    public save(testSuite: TestSuite, callback: (err: Error | null, identifier: number) => void) {
        DatabaseWrapper.getDatabase().then((db: Database) => {
            const handleError = (err: Error) => {
                db.run('ROLLBACK');
                callback(err, 0);
            }
    
            // Start transaction - necessary because testsuite needs to be inserted first since the tests 
            // need the id of the testsuite as a foregin key.
            db.run('BEGIN');
            // Insert the testsuite.
            let sql = `INSERT INTO testsuites(name) VALUES(?)`;
            db.run(sql, [testSuite.name], function (this: RunResult, err: Error) {
                if (err) {
                    return handleError(err);
                } else {
                    // Insert all tests. Done with promises so callback is only called if all inserts are successful.
                    sql = `INSERT INTO tests(testsuiteId, testType, parameters, logMessages) VALUES(?, ?, ?, ?)`;
                    const queries = testSuite.tests.map((test) => {
                        return new Promise<void>((resolve, reject) => {
                                db.run(sql, [this.lastID, test.testType, JSON.stringify(test.parameters), JSON.stringify(test.logMessages)], (err: Error) => {
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

export default TestSuiteFacade;