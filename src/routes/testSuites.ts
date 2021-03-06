import express, { Router } from 'express';
import TestSuiteFacade from '../database/testSuiteFacade';
import TestSuiteSchemeFacade from '../database/testSuiteSchemeFacade';
import TestSuite from '../models/executable/testSuite';
import TestSuiteScheme from '../models/schemes/testSuiteScheme';

const router: Router = express.Router();

router.get('/', (req, res) => {
    (new TestSuiteFacade()).getAll((err: Error | null, testSuites: TestSuite[] | null) => {
        if (err) {
            console.error(err.stack);
            res.status(500).send(err.message);
        } else {
            res.json(testSuites);
        }
    });
});

router.get('/:id', (req, res) => {
    const id: number = Number(req.params.id);
    if (id === NaN) {
        res.status(400).send('Id must be a number');
        return;
    }
    (new TestSuiteFacade()).getById(id, (err: Error | null, testSuite: TestSuite | null) => {
        if (err) {
            console.error(err.stack);
            res.status(500).send(err.message);
        } else if (testSuite === null) {
            res.sendStatus(404);
        } else {
            res.json(testSuite);
        }
    });
});

router.delete('/:id', (req, res) => {
    const id: number = Number(req.params.id);
    if (id === NaN) {
        res.status(400).send('Id must be a number');
        return;
    }
    (new TestSuiteFacade()).delete(id, (err: Error | null, identifier: number | null) => {
        if (err) {
            console.error(err.stack);
            res.status(500).send(err.message);
        } else if (identifier === null) {
            res.sendStatus(404);
        } else {
            res.json(identifier);
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
            console.error(err.stack);
            res.status(500).send(err.message);
        } else if (testSuiteScheme === null) {
            res.sendStatus(404);
        } else {
            const testSuite: TestSuite = testSuiteScheme.getTestSuite();

            (new TestSuiteFacade()).save(testSuite, (err: Error |??null, identifier: number) => {
                if (err) {
                    console.error(err.stack);
                    res.status(500).send(err.message);
                } else {
                    (new TestSuiteFacade()).getById(identifier, (err: Error |??null, testSuite: TestSuite |??null) => {
                        if (err) {
                            console.error(err.stack);
                            res.status(500).send(err.message);
                        } else {
                            testSuite?.execute();
                            res.status(201).send(identifier + '', );
                        }
                    });
                }
            });
        }
    });
});

export default router;