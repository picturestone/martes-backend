import Test from "./test";
import mqtt, { Client } from 'mqtt';

class AuthorizationTest extends Test {
    public static readonly type: string = 'authorization';

    private constructor() {
        super();
    }

    public static getInstance(): AuthorizationTest {
        return new AuthorizationTest();
    }

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