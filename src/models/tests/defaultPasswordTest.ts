import Test from "./test";
import mqtt, { Client } from 'mqtt';

class DefaultPasswordTest extends Test {
    public static readonly type: string = 'defaultPassword';

    private constructor(id?: number) {
        super(id);
    }

    public static getInstance(id?: number): DefaultPasswordTest {
        return new DefaultPasswordTest(id);
    }

    public get params(): {} {
        throw new Error("Method not implemented.");
    }

    public get type(): string {
        return DefaultPasswordTest.type;
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

export default DefaultPasswordTest;