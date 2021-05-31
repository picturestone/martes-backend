import express, { Router } from 'express';
import TestSuiteFacade from '../database/testSuiteFacade';
import Test from '../models/tests/test';
import TestSuite from '../models/testSuite';
import TestFactory from '../testFactory';

const router: Router = express.Router();

router.post('/', (req, res) => {
    const testFactory: TestFactory = TestFactory.getInstance();
    const testSuite: TestSuite = new TestSuite(req.body.name);

    try {
        req.body.tests.forEach((testData: { type: String; params: { [key: string]: string | number; }; }) => {
            const test: Test = testFactory.getTest(testData.type, testData.params);
            testSuite.tests.push(test);
        });
    } catch (error) {
        res.status(400).send(error.message);
        return;
    }

    (new TestSuiteFacade()).save(testSuite, (err: Error | null, identifier: number) => {
        if (err) {
            res.status(500).send(err.message);
        } else {
            res.status(200).send(identifier);
        }
    });
});

export default router;