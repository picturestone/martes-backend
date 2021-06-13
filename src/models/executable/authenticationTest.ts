import mqtt, { Client } from 'mqtt';
import AuthenticationTestParameters from '../testparameters/authenticationTestParameters';
import TestType from '../testtype';
import ExecutableTest from './executableTest';

class AuthenticationTest extends ExecutableTest<AuthenticationTestParameters> {
    public static readonly testType: TestType = TestType.Authentication;

    public get testType(): TestType {
        return AuthenticationTest.testType;
    }

    public executeTestScript(callback: (err: Error | null, isFinishedSuccessfuly?: boolean, failureReason?: string) => void): void {
        var isUnauthenticatedConnection: boolean = false;

        const unauthenticatedClient: Client = mqtt.connect(null, {
            host: '192.168.1.50',
            port: 1883,
            reconnectPeriod: 0
        });

        unauthenticatedClient.on('connect', () => {
            // Connecting without credentials is possible, so the test must be failed.
            isUnauthenticatedConnection = true;
            // Close connection.
            unauthenticatedClient.end(true);
            callback(null, false, 'Connection is unauthenticated');
        });

        unauthenticatedClient.on('close', () => {
            // If the previous connection was not closed because connecting without credentials is successful, continue testing.
            if (!isUnauthenticatedConnection) {
                const authenticatedClient: Client = mqtt.connect(null, {
                    host: '192.168.1.50',
                    port: 1883,
                    reconnectPeriod: 0,
                    username: 'martes',
                    password: 'martes'
                });
        
                authenticatedClient.on('error', (error) => {
                    // Authentication with credentials failed - might be because of wrong credentials.
                    callback(null, false, error.message);
                });
        
                authenticatedClient.on('connect', () => {
                    // Authentication with credentials is successful.
                    authenticatedClient.end(true);
                    callback(null, true);
                });
            }
        });
    }
}

export default AuthenticationTest;