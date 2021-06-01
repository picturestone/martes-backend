import AuthenticationTest from './models/tests/authenticationTest';
import ConnectionTest from './models/tests/connectionTest';
import Test from './models/tests/test';
import WildcardSubscriptionTest from './models/tests/wildcardSubscriptionTest';

class TestFactory {
    private static _instance: TestFactory;

    private constructor() {
    }

    public getTest(type: String, params: {[key: string]: string|number}, id?: number): Test {
        var test: Test | null = null;

        switch (type) {
            case ConnectionTest.type:
                test = ConnectionTest.getInstance(params, id);
                break;
        
            case AuthenticationTest.type:
                test = AuthenticationTest.getInstance(id);
                break;
            
            case WildcardSubscriptionTest.type:
                test = WildcardSubscriptionTest.getInstance(id);
                break;

            default:
                break;
        }

        if (!test) {
            throw new Error('Test with type \'' + type +'\' not found.');
        }

        return test;
    }

    public getTestTypes(): String[] {
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