import mqtt, { Client } from 'mqtt';
import ConnectionTestScheme from '../schemes/connectionTestScheme';
import Executable from './executable';

class ConnectionTest extends ConnectionTestScheme implements Executable {
    public constructor(host: string, port: number, id?: number) {
        super(host, port, id);
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