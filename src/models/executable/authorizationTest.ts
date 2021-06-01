import mqtt, { Client } from 'mqtt';
import AuthorizationTestScheme from '../schemes/authorizationTestScheme';
import Executable from './executable';

class AuthorizationTest extends AuthorizationTestScheme implements Executable {
    execute(callback: (isSuccessful: boolean, message?: string) => any): void {
        const client: Client = mqtt.connect(null, {
            host: '192.168.1.50',
            port: 1883,
            reconnectPeriod: 0,
        });
        
        client.on('connect', () => {
            callback(true);
        });
    
        client.on('error', (error) => {
            callback(false, error.message);
        });
    }
}

export default AuthorizationTest;