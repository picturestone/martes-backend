import { Database, RunResult } from 'sqlite3';
import DatabaseWrapper from './databaseWrapper';
import TestScheme from '../models/schemes/testScheme';
import TestSuiteScheme from "../models/schemes/testSuiteScheme";
import TestFactory from '../testFactory';
import TestSuite from '../models/executable/testSuite';
import Executable from '../models/executable/executable';

class TestSuiteFacade {
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
                        const testSuite = new TestSuite(rows[0].name, rows[0].testsuiteschemeId);
                        const tests: Executable[] = [];
                        const testFactory: TestFactory = TestFactory.getInstance();
                        rows.forEach((row) => {
                            tests.push(testFactory.getTestScheme(row.testType, JSON.parse(row.params), row.id).getExecutableInstance());
                        });
                        testSuite.tests = tests;
                        callback(null, testSuite);
                    }
                }
            });
        });
    }

    // TODO fix
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
                    sql = `INSERT INTO testschemes(testsuiteschemeId, testType, params) VALUES(?, ?, ?)`;
                    const queries = testSuiteScheme.testSchemes.map((testScheme) => {
                        return new Promise<void>((resolve, reject) => {
                                db.run(sql, [this.lastID, testScheme.type, JSON.stringify(testScheme.params)], (err: Error) => {
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