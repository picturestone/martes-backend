import AuthenticationTest from './authenticationTest';
import ConnectionTest from './connectionTest';
import Test from './test';

class TestFactory {
    private static _instance: TestFactory;

    public getTest(name: String): Test {
        var test: Test | null = null;

        switch (name) {
            case 'connection':
                test = new ConnectionTest();
                break;
        
            case 'authentication':
                test = new AuthenticationTest();
                break;

            default:
                break;
        }

        if (!test) {
            throw new Error('Test with name \'' + name +'\' not found.');
        }

        return test;
    }

    public getTestNames(): String[] {
        return ['connection'];
    }

    public static getInstance(): TestFactory {
        if (!TestFactory._instance) {
            TestFactory._instance = new TestFactory();
        }

        return TestFactory._instance;
    }
}

export default TestFactory;