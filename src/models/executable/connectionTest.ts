import mqtt, { Client } from 'mqtt';
import ConnectionTestParameters from '../testparameters/connectionTestParameters';
import TestType from '../testtype';
import ExecutableTest from './executableTest';

class ConnectionTest extends ExecutableTest<ConnectionTestParameters> {
    public static readonly testType: TestType = TestType.Connection;

    public get testType(): TestType {
        return ConnectionTest.testType;
    }

    public executeTestScript(callback: (err: Error | null, isFinishedSuccessfuly?: boolean, failureReason?: string) => void): void {
        var isServerRunning: boolean = false;

        this.log('info', 'Opening connection...');
        const client: Client = mqtt.connect(null, {
            host: this.parameters.host,
            port: this.parameters.port,
            reconnectPeriod: 0,
            connectTimeout: 10 * 1000
        });

        client.on('packetreceive', () => {
            // Packet is received, so the connection can be established. Set marker and close connection.
            this.log('info', 'Connection opened');
            isServerRunning = true;
            client.end(true);
            callback(null, true);
        });

        client.on('close', () => {
            // If connection is closed by timeout, then isServerRunning is still false so the connection failed.
            if (!isServerRunning) {
                this.log('info', 'Connection timed out');
                callback(null, false, 'Connection failed - check if the server is running and the parameters are correct');
            }
        });
    }
}

export default ConnectionTest;