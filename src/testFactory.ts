import AuthenticationTest from './models/executable/authenticationTest';
import ConnectionTest from './models/executable/connectionTest';
import ExecutableTest from './models/executable/executableTest';
import WildcardSubscriptionTest from './models/executable/wildcardSubscriptionTest';
import AuthenticationTestScheme from './models/schemes/authenticationTestScheme';
import ConnectionTestScheme from './models/schemes/connectionTestScheme';
import TestScheme from './models/schemes/testScheme';
import WildcardSubscriptionTestScheme from './models/schemes/wildcardSubscriptionTestScheme';
import ConnectionTestParameters from './models/testparameters/connectionTestParameters';
import TestType from './models/testtype';

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