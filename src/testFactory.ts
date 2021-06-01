import AuthenticationTestScheme from './models/schemes/authenticationTestScheme';
import ConnectionTestScheme from './models/schemes/connectionTestScheme';
import Test from './models/schemes/testScheme';
import WildcardSubscriptionTestScheme from './models/schemes/wildcardSubscriptionTestScheme';

class TestFactory {
    private static _instance: TestFactory;

    private constructor() {
    }

    public getTest(type: String, params: {[key: string]: string|number}, id?: number): Test {
        var test: Test | null = null;

        switch (type) {
            case ConnectionTestScheme.type:
                test = ConnectionTestScheme.getInstance(params, id);
                break;
        
            case AuthenticationTestScheme.type:
                test = AuthenticationTestScheme.getInstance(id);
                break;
            
            case WildcardSubscriptionTestScheme.type:
                test = WildcardSubscriptionTestScheme.getInstance(id);
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
            ConnectionTestScheme.type,
            AuthenticationTestScheme.type,
            WildcardSubscriptionTestScheme.type
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