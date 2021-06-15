import mqtt, { Client } from 'mqtt';
import crypto from 'crypto';
import AuthorizationTestParameters from '../testparameters/authorizationTestParameters';
import TestType from '../testtype';
import ExecutableTest from './executableTest';

class AuthorizationTest extends ExecutableTest<AuthorizationTestParameters> {
    public static readonly testType: TestType = TestType.Authorization;
    private timoutAfter: number;

    constructor(parameters: AuthorizationTestParameters, id?: number) {
        super(parameters, id);
        this.timoutAfter = parseInt(process.env.TIMEOUT_AFTER as string, 10);
        this.wikiLink = (process.env.WIKI_BASE_URL as string) + '/en/missing-authorization';
    }

    public get testType(): TestType {
        return AuthorizationTest.testType;
    }

    public executeTestScript(callback: (err: Error | null, isFinishedSuccessfuly?: boolean, failureReason?: string) => void): void {
        const uuid: string = crypto.randomBytes(16).toString('base64');
        var continueTest: boolean = true;
        this.log('running', 'Opening connection without credentials...');
        const unauthenticatedClient: Client = mqtt.connect(null, {
            host: this.parameters.host,
            port: this.parameters.port,
            reconnectPeriod: 0,
            connectTimeout: this.timoutAfter
        });

        unauthenticatedClient.on('connect', () => {
            // Connecting without credentials is possible, subscribe to topic and send dummy data.
            this.log('running', 'Connection without credentials opened');
            unauthenticatedClient.subscribe(this.parameters.topic, (error) => {
                if (error) {
                    // Subscribing failed. Log error and finish test.
                    continueTest = false;
                    this.log('error', error.message);
                    unauthenticatedClient.on('close', () => {
                        this.log('running', 'Connection without credentials closed');
                        callback(null, false, `An error occured when subscribing to the topic ${this.parameters.topic} with the unauthenticated client`);
                    });
                    unauthenticatedClient.end(true);

                } else {
                    // Subscribing successful.
                    this.log('running', 'Listening for messages on connection without credentials');
                    //Register event to listen to received message.
                    unauthenticatedClient.on('message', () => {
                        this.log('running', `Message received from ${this.parameters.topic} on connection without credentials`);
                        // Data receiving is successful.
                        continueTest = false;
                        // Close connection.
                        unauthenticatedClient.on('close', () => {
                            this.log('running', 'Connection without credentials closed');
                            // Log failed test as ACL should prevent this.
                            callback(null, false, `Reading data from the topic ${this.parameters.topic} with an unauthenticated client was successful. Check the wiki for help.`);
                        });
                        unauthenticatedClient.end(true);
                    });

                    // Send some data on the topic.
                    // Replace topic with allowed one.
                    unauthenticatedClient.publish(this.parameters.topic, uuid, (error) => {
                        if (error) {
                            // Publishing failed. Log error and finish test.
                            continueTest = false;
                            this.log('error', error.message);
                            // Close connection.
                            unauthenticatedClient.on('close', () => {
                                this.log('running', 'Connection without credentials closed');
                                callback(null, false, `An error occured when publishing on the topic ${this.parameters.topic} with the unauthenticated client`);
                            });
                            unauthenticatedClient.end(true);
                        } else {
                            this.log('running', `Sending message to ${this.parameters.topic} on connection without credentials`);
                        }
                    });

                    setTimeout(() => {
                        // No message has been received - sending or receiving with unauthenticated client is not possible. Continue testing...
                        // If timout is reached without getting a message and the test should still be continued, close connection and move on to authenticated testing.
                        if (continueTest) {
                            this.log('running', 'No message received on connection without credentials');
                            unauthenticatedClient.end(true);
                        }
                    }, this.timoutAfter);
                }
            });
        });

        unauthenticatedClient.on('close', () => {
            if (continueTest) {
                var isLoggingOnClose: boolean = true;
                // Continue testing with authenticated client.
                this.log('running', 'Connection without credentials closed');
                this.log('running', 'Opening connection with credentials...');
                const authenticatedClient: Client = mqtt.connect(null, {
                    host: this.parameters.host,
                    port: this.parameters.port,
                    username: this.parameters.username,
                    password: this.parameters.password,
                    reconnectPeriod: 0,
                    connectTimeout: this.timoutAfter
                });
        
                authenticatedClient.on('error', (error) => {
                    // Authorization with credentials failed - might be because of wrong credentials.
                    // Turn off logs
                    isLoggingOnClose = false;
                    authenticatedClient.end(true);
                    this.log('error', error.message);
                    callback(null, false, 'An error occured - check if the credentials are correct');
                });

                authenticatedClient.on('close', () => {
                    if (isLoggingOnClose) {
                        this.log('running', 'Connection with credentials closed');
                        callback(null, false, 'Connecting with credentials failed - check if the server is running and the parameters are correct');
                    }
                });
        
                authenticatedClient.on('connect', () => {
                    // Connecting with credentials is possible, subscribe to topic and send dummy data.
                    this.log('running', 'Connection with credentials opened');
                    authenticatedClient.subscribe(this.parameters.topic, (error) => {
                        if (error) {
                            // Subscribing failed. Log error and finish test.
                            isLoggingOnClose = false;
                            authenticatedClient.end(true);
                            this.log('error', error.message);
                            callback(null, false, `An error occured when subscribing to the topic ${this.parameters.topic} with the authenticated client`);
                        } else {
                            this.log('running', 'Listening for messages on connection with credentials');
                            // Subscribing successful. Register event to listen to received message.
                            authenticatedClient.on('message', () => {
                                this.log('running', `Message received from ${this.parameters.topic} on connection with credentials`);
                                continueTest = false;
                                isLoggingOnClose = false;
                                authenticatedClient.on('close', () => {
                                    this.log('running', 'Connection with credentials closed');
                                    // Log failed test as ACL should prevent this.
                                    callback(null, false, `Reading data from the topic ${this.parameters.topic} with an authenticated client was successful. Check the wiki for help.`);
                                });
                                // Data receiving is successful.
                                // Close connection.
                                authenticatedClient.end(true);
                            });

                            // Send some data on the topic.
                            authenticatedClient.publish(this.parameters.topic, uuid, (error) => {
                                if (error) {
                                    continueTest = false;
                                    // Publishing failed. Log error and finish test.
                                    isLoggingOnClose = false;
                                    authenticatedClient.end(true);
                                    this.log('error', error.message);
                                    callback(null, false, `An error occured when publishing on the topic ${this.parameters.topic} with the authenticated client`);
                                } else {
                                    this.log('running', `Sending message to ${this.parameters.topic} on connection with credentials`);
                                }
                            });

                            setTimeout(() => {
                                if (continueTest) {
                                    // No message has been received - sending or receiving with authenticated client is not possible. Test is successful.
                                    isLoggingOnClose = false;
                                    this.log('running', 'No message received on connection with credentials');
                                    authenticatedClient.on('close', () => {
                                        this.log('running', 'Connection with credentials closed');
                                        callback(null, true);
                                    });
                                    authenticatedClient.end(true);
                                }
                            }, this.timoutAfter);
                        }
                    });
                });
            }
        });
    }
}

export default AuthorizationTest;