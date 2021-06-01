import TestScheme from './testScheme';
import mqtt, { Client } from 'mqtt';

class AuthorizationTest extends TestScheme {
    public static readonly type: string = 'authorization';

    private constructor(id?: number) {
        super(id);
    }

    public static getInstance(id?: number): AuthorizationTest {
        return new AuthorizationTest(id);
    }

    public get params(): {} {
        throw new Error("Method not implemented.");
    }

    public get type(): string {
        return AuthorizationTest.type;
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