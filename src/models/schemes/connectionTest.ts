import Test from "./test";
import mqtt, { Client } from 'mqtt';

class ConnectionTest extends Test {
    public static readonly type: string = 'connection';

    private host: string;
    private port: number;

    private constructor(host: string, port: number, id?: number) {
        super(id);
        this.host = host;
        this.port = port;
    }

    public static getInstance(params: any, id?: number): ConnectionTest {
        const host: string = params.host;
        const port: number = params.port;
        if(!host || !port) {
            throw new Error('Missing parameters to create test of type ' + this.type);
        }

        return new ConnectionTest(host, port, id);
    }

    public get params(): {} {
        return {
            host: this.host,
            port: this.port
        }
    }

    public get type(): string {
        return ConnectionTest.type;
    }
    
    public execute(callback: (isSuccessful: boolean, message?: string) => any): void {
        var isServerRunning: boolean = false;

        const client: Client = mqtt.connect(null, {
            host: this.host,
            port: this.port,
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