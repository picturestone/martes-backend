import express, { Router } from 'express';
import Test from '../models/tests/test';
import TestFactory from '../testFactory';

const router: Router = express.Router();

router.get('/', (req, res) => {
    // var test: Test;

    // try {
    //     test = TestFactory.getInstance().getTestScheme('connection');

    //     test.execute((isSuccessful, message) => {
    //         if (isSuccessful) {
    //             res.sendStatus(200);
    //         } else {
    //             res.send({'Error': message});
    //             res.status(400);
    //         }
    //     });
    // } catch (error) {
    //     console.log(error);
    //     res.json({'Error': error.message});
    //     res.status(400);
    // }
});

export default router;