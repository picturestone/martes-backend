import mqtt, { Client } from 'mqtt';
import ConnectionTestParameters from '../testparameters/connectionTestParameters';
import TestType from '../testtype';
import ExecutableTest from './executableTest';

class ConnectionTest extends ExecutableTest<ConnectionTestParameters> {
    public static readonly testType: TestType = TestType.Connection;

    public get testType(): TestType {
        return ConnectionTest.testType;
    }

    public execute(callback: (isSuccessful: boolean, message?: string) => any): void {
        var isServerRunning: boolean = false;

        const client: Client = mqtt.connect(null, {
            host: this.parameters.host,
            port: this.parameters.port,
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