import express, { Router } from 'express';
import TestSuiteSchemeFacade from '../database/testSuiteSchemeFacade';
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
    (new TestSuiteSchemeFacade()).getById(id, (err: Error | null, testSuiteScheme: TestSuiteScheme | null) => {
        if (err) {
            res.status(500).send(err.message);
        } else if (testSuiteScheme === null) {
            res.sendStatus(404);
        } else {
            res.json(testSuiteScheme);
        }
    });
});

router.post('/', (req, res) => {
    const testFactory: TestFactory = TestFactory.getInstance();
    const testSuiteScheme: TestSuiteScheme = new TestSuiteScheme(req.body.name);

    try {
        req.body.tests.forEach((testData: { type: String; params: { [key: string]: string | number; }; }) => {
            const testScheme: TestScheme = testFactory.getTest(testData.type, testData.params);
            testSuiteScheme.testSchemes.push(testScheme);
        });
    } catch (error) {
        res.status(400).send(error.message);
        return;
    }

    (new TestSuiteSchemeFacade()).save(testSuiteScheme, (err: Error | null, identifier: number) => {
        if (err) {
            res.status(500).send(err.message);
        } else {
            res.status(201).send(identifier + '', );
        }
    });
});

export default router;