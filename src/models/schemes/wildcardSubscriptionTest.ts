import TestScheme from './testScheme';
import mqtt, { Client } from 'mqtt';
import crypto from 'crypto';

class WildcardSubscriptionTest extends TestScheme {
    public static readonly type: string = 'wildcardSubscription';

    private constructor(id?: number) {
        super(id);
    }

    public static getInstance(id?: number): WildcardSubscriptionTest {
        return new WildcardSubscriptionTest(id);
    }

    public get params(): {} {
        throw new Error("Method not implemented.");
    }

    public get type(): string {
        return WildcardSubscriptionTest.type;
    }
    
    execute(callback: (isSuccessful: boolean, message?: string) => any): void {
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
                callback(false, error.message);

                unauthenticatedClient.on('message', (topic, message) => {
                    if (message.toString() === uuid) {
                        // Subscribing and publishing to wild card topic is possible. The test failed.
                        isWildcardSubscriptionSuccessful = true;
                        // Close connection.
                        unauthenticatedClient.end(true);
                        // Log failed test:
                        callback(false, 'Subscribing and publishing to wild card topic \'#\' is possible.');
                    }
                });

                // Replace topic with allowed one.
                unauthenticatedClient.publish('martes/test', uuid, (error) => {
                    // Log error
                    callback(false, error?.message)
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