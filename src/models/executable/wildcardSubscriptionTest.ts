import mqtt, { Client } from 'mqtt';
import crypto from 'crypto';
import ExecutableTest from './executableTest';
import WildcardSubscriptionTestParameters from '../testparameters/wildcardSubscriptionTestParameters';
import TestType from '../testtype';

class WildcardSubscriptionTest extends ExecutableTest<WildcardSubscriptionTestParameters> {
    public static readonly testType: TestType = TestType.Connection;

    public get testType(): TestType {
        return WildcardSubscriptionTest.testType;
    }

    public executeTestScript(callback: (err: Error | null, isFinishedSuccessfuly?: boolean, failureReason?: string) => void): void {
        var isWildcardSubscriptionSuccessful: boolean = false;
        const uuid: string = crypto.randomBytes(16).toString('base64');

        const unauthenticatedClient: Client = mqtt.connect(null, {
            host: '192.168.1.50',
            port: 1883,
            reconnectPeriod: 0
        });

        // TODO the connection needs to be closed at some point, we cant wait until the correct message is received, maybe it cant be sent!
        unauthenticatedClient.on('connect', () => {
            unauthenticatedClient.subscribe('#', (error, granted) => {
                // Log error:
                callback(error);

                unauthenticatedClient.on('message', (topic, message) => {
                    if (message.toString() === uuid) {
                        // Subscribing and publishing to wild card topic is possible. The test failed.
                        isWildcardSubscriptionSuccessful = true;
                        // Close connection.
                        unauthenticatedClient.end(true);
                        // Log failed test:
                        callback(new Error('Subscribing and publishing to wild card topic \'#\' is possible.'));
                    }
                });

                // Replace topic with allowed one.
                unauthenticatedClient.publish('martes/test', uuid, (error) => {
                    if(error) {
                        // Log error
                        callback(error)
                    }
                });
            });
        });

        unauthenticatedClient.on('close', () => {
            // The connection can be closed 
            if (!isWildcardSubscriptionSuccessful) {

            }
        });
    }
}

export default WildcardSubscriptionTest;