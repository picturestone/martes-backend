import mqtt, { Client } from 'mqtt';
import AuthenticationTestScheme from '../schemes/authenticationTestScheme';
import Executable from './executable';

class AuthenticationTest extends AuthenticationTestScheme implements Executable {
    execute(callback: (isSuccessful: boolean, message?: string) => any): void {
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
            callback(false, 'Connection is unauthenticated');
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
                    callback(false, error.message);
                });
        
                authenticatedClient.on('connect', () => {
                    // Authentication with credentials is successful.
                    authenticatedClient.end(true);
                    callback(true);
                });
            }
        });
    }
}

export default AuthenticationTest;