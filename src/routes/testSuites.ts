import express, { Router } from 'express';
import TestSuiteFacade from '../database/testSuiteFacade';
import TestSuiteSchemeFacade from '../database/testSuiteSchemeFacade';
import TestSuite from '../models/executable/testSuite';
import TestScheme from '../models/schemes/testScheme';
import TestSuiteScheme from '../models/schemes/testSuiteScheme';
import TestFactory from '../testFactory';

const router: Router = express.Router();

router.get('/:id', (req, res) => {
    const id: number = Number(req.params.id);
    if (id === NaN) {
        res.status(400).send('Id must be a number');
        return;
    }
    (new TestSuiteFacade()).getById(id, (err: Error | null, testSuite: TestSuite | null) => {
        if (err) {
            res.status(500).send(err.message);
        } else if (testSuite === null) {
            res.sendStatus(404);
        } else {
            res.json(testSuite);
        }
    });
});

// Creates a testSuite from the testSuiteScheme with the given ID and starts the testsuite.
router.post('/:id', (req, res) => {
    const id: number = Number(req.params.id);
    if (id === NaN) {
        res.status(400).send('Id must be a number');
        return;
    }
    (new TestSuiteSchemeFacade()).getById(id, (err: Error | null, testSuiteScheme: TestSuiteScheme | null) => {
        if (err) {
            res.status(500).send(err.message);
        } else if (testSuiteScheme === null) {
            res.sendStatus(404);
        } else {
            const testSuite: TestSuite = new TestSuite(testSuiteScheme);

            (new TestSuiteFacade()).save(testSuite, (err: Error | null, identifier: number) => {
                if (err) {
                    res.status(500).send(err.message);
                } else {
                    //testSuite.execute();
                    res.status(201).send(identifier + '', );
                }
            });
        }
    });
});

export default router;