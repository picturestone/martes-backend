import { Database, RunResult } from 'sqlite3';
import DatabaseWrapper from '../database/databaseWrapper';
import Test from '../models/tests/test';
import TestSuite from "../models/testSuite";
import TestFactory from '../testFactory';

class TestSuiteFacade {
    public getById(id: number, callback: (err: Error | null, testSuite: TestSuite | null) => void) {
        DatabaseWrapper.getDatabase().then((db: Database) => {
            const sql = `SELECT * FROM testsuites as ts LEFT JOIN tests as t ON ts.id = t.testsuitesId WHERE ts.id = ?`;
            db.all(sql, [id], (err: Error, rows: any[]) => {
                if (err) {
                    callback(err, null);
                } else {
                    if (rows.length === 0) {
                        callback(null, null);
                    } else {
                        const testSuite = new TestSuite(rows[0].name, rows[0].testsuitesId);
                        const tests: Test[] = [];
                        const testFactory: TestFactory = TestFactory.getInstance();
                        rows.forEach((row) => {
                            tests.push(testFactory.getTest(row.testType, JSON.parse(row.params), row.id));
                        });
                        testSuite.tests = tests;
                        callback(null, testSuite);
                    }
                }
            });
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
                    sql = `INSERT INTO tests(testsuitesId, testType, params) VALUES(?, ?, ?)`;
                    const queries = testSuite.tests.map((test) => {
                        return new Promise<void>((resolve, reject) => {
                                db.run(sql, [this.lastID, test.type, JSON.stringify(test.params)], (err: Error) => {
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