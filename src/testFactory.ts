import AuthenticationTest from './models/tests/authenticationTest';
import ConnectionTest from './models/tests/connectionTest';
import Test from './models/tests/test';
import WildcardSubscriptionTest from './models/tests/wildcardSubscriptionTest';

class TestFactory {
    private static _instance: TestFactory;

    private constructor() {
    }

    public getTest(name: String): Test {
        var test: Test | null = null;

        switch (name) {
            case ConnectionTest.type:
                test = ConnectionTest.getInstance();
                break;
        
            case AuthenticationTest.type:
                test = AuthenticationTest.getInstance();
                break;
            
            case WildcardSubscriptionTest.type:
                test = WildcardSubscriptionTest.getInstance();
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
        return [
            ConnectionTest.type,
            AuthenticationTest.type,
            WildcardSubscriptionTest.type
        ];
    }

    public static getInstance(): TestFactory {
        if (!TestFactory._instance) {
            TestFactory._instance = new TestFactory();
        }

        return TestFactory._instance;
    }
}

export default TestFactory;