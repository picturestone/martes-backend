import AuthenticationTestScheme from './models/schemes/authenticationTestScheme';
import ConnectionTestScheme from './models/schemes/connectionTestScheme';
import TestScheme from './models/schemes/testScheme';
import WildcardSubscriptionTestScheme from './models/schemes/wildcardSubscriptionTestScheme';

class TestFactory {
    private static _instance: TestFactory;

    private constructor() {
    }

    public getTestScheme(testType: string, params: any, id?: number): TestScheme<any> {
        var test: TestScheme<{}> | null = null;

        switch (testType) {
            case ConnectionTestScheme.testType:
                const host: string = params.host;
                const port: number = params.port;
                if(!host || !port) {
                    throw new Error('Missing parameters to create test of type ' + testType);
                }
                test = new ConnectionTestScheme({host, port}, id);
                break;
        
            case AuthenticationTestScheme.testType:
                test = new AuthenticationTestScheme({}, id);
                break;
            
            case WildcardSubscriptionTestScheme.testType:
                test = new WildcardSubscriptionTestScheme({}, id);
                break;

            default:
                break;
        }

        if (!test) {
            throw new Error('Test with type ' + testType +' not found.');
        }

        return test;
    }

    public static getInstance(): TestFactory {
        if (!TestFactory._instance) {
            TestFactory._instance = new TestFactory();
        }

        return TestFactory._instance;
    }
}

export default TestFactory;