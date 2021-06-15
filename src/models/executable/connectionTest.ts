import mqtt, { Client } from 'mqtt';
import ConnectionTestParameters from '../testparameters/connectionTestParameters';
import TestType from '../testtype';
import ExecutableTest from './executableTest';

class ConnectionTest extends ExecutableTest<ConnectionTestParameters> {
    public static readonly testType: TestType = TestType.Connection;
    private timoutAfter: number;

    constructor(parameters: ConnectionTestParameters, id?: number) {
        super(parameters, id);
        this.timoutAfter = parseInt(process.env.TIMEOUT_AFTER as string, 10);
    }

    public get testType(): TestType {
        return ConnectionTest.testType;
    }

    public executeTestScript(callback: (err: Error | null, isFinishedSuccessfuly?: boolean, failureReason?: string) => void): void {
        var isServerRunning: boolean = false;

        this.log('running', 'Opening connection...');
        const client: Client = mqtt.connect(null, {
            host: this.parameters.host,
            port: this.parameters.port,
            reconnectPeriod: 0,
            connectTimeout: this.timoutAfter
        });

        client.on('packetreceive', () => {
            // Packet is received, so the connection can be established. Set marker and close connection.
            this.log('running', 'Connection opened');
            isServerRunning = true;
            client.end(true);
            callback(null, true);
        });

        client.on('close', () => {
            // If connection is closed by timeout, then isServerRunning is still false so the connection failed.
            if (!isServerRunning) {
                this.log('running', 'Connection timed out');
                callback(null, false, 'Connection failed - check if the server is running and the parameters are correct');
            }
        });
    }
}

export default ConnectionTest;