import Test from "./test";
import mqtt, { Client } from 'mqtt';

class ConnectionTest extends Test {
    public static readonly type: string = 'connection';

    private constructor() {
        super();
    }

    public static getInstance(): ConnectionTest {
        return new ConnectionTest();
    }
    
    execute(callback: (isSuccessful: boolean, message?: string) => any): void {
        var isServerRunning: boolean = false;

        const client: Client = mqtt.connect(null, {
            host: '192.168.1.50',
            port: 1884,
            reconnectPeriod: 0,
            connectTimeout: 10 * 1000
        });

        client.on('packetreceive', () => {
            // Packet is received, so the server must be running. Set marker and close connection.
            isServerRunning = true;
            client.end(true);
            callback(true);
        });

        client.on('close', () => {
            // If connection is closed by timeout, then isServerRunning is still false so the connection failed.
            if (!isServerRunning) {
                callback(false, 'Connection failed');
            }
        });
    }
}

export default ConnectionTest;