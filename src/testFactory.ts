import AuthenticationTest from './models/executable/authenticationTest';
import ConnectionTest from './models/executable/connectionTest';
import ExecutableTest from './models/executable/executableTest';
import WildcardSubscriptionTest from './models/executable/wildcardSubscriptionTest';
import AuthenticationTestScheme from './models/schemes/authenticationTestScheme';
import ConnectionTestScheme from './models/schemes/connectionTestScheme';
import TestScheme from './models/schemes/testScheme';
import WildcardSubscriptionTestScheme from './models/schemes/wildcardSubscriptionTestScheme';

class TestFactory {
    private static _instance: TestFactory;

    private constructor() {
    }

    // TODO once optional parameters are created maybe this should be checked here?
    public getTestScheme(testType: string, params: any, id?: number): TestScheme<any> {
        var test: TestScheme<{}> | null = null;
        let host: string;
        let port: number;
        let username: string;
        let password: string;
        switch (testType) {
            case ConnectionTestScheme.testType:
                host = params.host;
                port = params.port;
                if(!host || !port) {
                    throw new Error('Missing parameters to create test scheme of type ' + testType);
                }
                test = new ConnectionTestScheme({host, port}, id);
                break;
        
            case AuthenticationTestScheme.testType:
                host = params.host;
                port = params.port;
                username = params.username;
                password = params.password;
                if(!host || !port || !username || !password) {
                    throw new Error('Missing parameters to create test scheme of type ' + testType);
                }
                test = new AuthenticationTestScheme({host, port, username, password}, id);
                break;
            
            case WildcardSubscriptionTestScheme.testType:
                host = params.host;
                port = params.port;
                if(!host || !port) {
                    throw new Error('Missing parameters to create test scheme of type ' + testType);
                }
                test = new WildcardSubscriptionTestScheme({host, port}, id);
                break;

            default:
                break;
        }

        if (!test) {
            throw new Error('Test scheme with type ' + testType +' not found.');
        }

        return test;
    }

    public getExecutableTest(testType: string, params: any, id?: number): ExecutableTest<any> {
        var test: ExecutableTest<{}> | null = null;
        let host: string;
        let port: number;
        let username: string;
        let password: string;
        switch (testType) {
            case ConnectionTest.testType:
                host = params.host;
                port = params.port;
                if(!host || !port) {
                    throw new Error('Missing parameters to create test of type ' + testType);
                }
                test = new ConnectionTest({host, port}, id);
                break;
        
            case AuthenticationTest.testType:
                host = params.host;
                port = params.port;
                username = params.username;
                password = params.password;
                if(!host || !port || !username || !password) {
                    throw new Error('Missing parameters to create test of type ' + testType);
                }
                test = new AuthenticationTest({host, port, username, password}, id);
                break;
            
            case WildcardSubscriptionTest.testType:
                host = params.host;
                port = params.port;
                if(!host || !port) {
                    throw new Error('Missing parameters to create test of type ' + testType);
                }
                test = new WildcardSubscriptionTest({host, port}, id);
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