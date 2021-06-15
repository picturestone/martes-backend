import mqtt, { Client } from 'mqtt';
import AuthenticationTestParameters from '../testparameters/authenticationTestParameters';
import TestType from '../testtype';
import ExecutableTest from './executableTest';

class AuthenticationTest extends ExecutableTest<AuthenticationTestParameters> {
    public static readonly testType: TestType = TestType.Authentication;
    private timoutAfter: number;

    constructor(parameters: AuthenticationTestParameters, id?: number) {
        super(parameters, id);
        this.timoutAfter = parseInt(process.env.TIMEOUT_AFTER as string, 10);
        this.wikiLink = (process.env.WIKI_BASE_URL as string) + '/en/missing-authentication';
    }

    public get testType(): TestType {
        return AuthenticationTest.testType;
    }

    public executeTestScript(callback: (err: Error | null, isFinishedSuccessfuly?: boolean, failureReason?: string) => void): void {
        var isUnauthenticatedConnectionPossible: boolean = false;
        this.log('running', 'Opening connection without credentials...');
        const unauthenticatedClient: Client = mqtt.connect(null, {
            host: this.parameters.host,
            port: this.parameters.port,
            reconnectPeriod: 0,
            connectTimeout: this.timoutAfter
        });

        unauthenticatedClient.on('connect', () => {
            // Connecting without credentials is possible, so the test must be failed.
            // Close connection.
            this.log('running', 'Connection without credentials opened');
            isUnauthenticatedConnectionPossible = true;
            unauthenticatedClient.end(true);
            callback(null, false, 'Connection is unauthenticated. Check the wiki for help.');
        });

        unauthenticatedClient.on('close', () => {
            if (!isUnauthenticatedConnectionPossible) {
                var isLoggingOnClose: boolean = true;

                // If the previous connection was not closed because connecting without credentials is successful, continue testing.
                this.log('running', 'Connection without credentials closed');
                this.log('running', 'Opening connection with credentials...');
                const authenticatedClient: Client = mqtt.connect(null, {
                    host: this.parameters.host,
                    port: this.parameters.port,
                    username: this.parameters.username,
                    password: this.parameters.password,
                    reconnectPeriod: 0,
                    connectTimeout: this.timoutAfter
                });
        
                authenticatedClient.on('error', (error) => {
                    // Authentication with credentials failed - might be because of wrong credentials.
                    // Turn off logs
                    isLoggingOnClose = false;
                    authenticatedClient.end(true);
                    this.log('error', error.message);
                    callback(null, false, 'An error occured - check if the credentials are correct');

                });
        
                authenticatedClient.on('connect', () => {
                    // Authentication with credentials is successful.
                    isLoggingOnClose = false;
                    this.log('running', 'Connection with credentials opened');
                    authenticatedClient.end(true);
                    callback(null, true);
                });

                authenticatedClient.on('close', () => {
                    if (isLoggingOnClose) {
                        this.log('error', 'Connection without credentials closed');
                        authenticatedClient.end(true);
                        callback(null, false, 'Connecting with credentials failed - check if the server is running and the parameters are correct');
                    }
                });
            }
        });
    }
}

export default AuthenticationTest;