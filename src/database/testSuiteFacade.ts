import { Database, RunResult } from 'sqlite3';
import DatabaseWrapper from '../database/databaseWrapper';
import TestSuite from "../models/testSuite";

class TestSuiteFacade {
    public save(testSuite: TestSuite, callback: (err: Error | null, identifier: number) => void) {
        const db: Database = DatabaseWrapper.getDatabase();

        const handleError = (err: Error) => {
            db.run('ROLLBACK');
            console.log('rolled back');
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
                // Insert all tests.
                let sql = `INSERT INTO tests(testsuitesId, testType, params) VALUES(?, ?, ?)`;
                testSuite.tests.forEach(test => {
                    db.run(sql, [this.lastID, test.type, JSON.stringify(test.params)], (err: Error) => {
                        if (err) {
                            handleError(err);
                        } else {
                            db.run('COMMIT', handleError);
                            callback(null, this.lastID);
                        }
                    });
                });
            }
        });
    }
}

export default TestSuiteFacade;