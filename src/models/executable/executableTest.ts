import DatabaseLogger from "../../logging/DatabaseLogger";
import Logger from "../../logging/logger";
import LogMessage from "../../logging/logMessage";
import TestType from "../testtype";

abstract class ExecutableTest<parametersType> {
    public id: number | undefined;
    public parameters: Readonly<parametersType>;
    public logMessages: LogMessage[];
    private loggers: Logger[];

    constructor(parameters: parametersType, id?: number) {
        this.id = id;
        this.parameters = parameters;
        this.logMessages = [];
        this.loggers = [
            new DatabaseLogger(this)
        ];
    }

    // Custom toJSON method to include testType when converting to json. 
    toJSON() {
        return {
            id: this.id,
            testType: this.testType,
            parameters: this.parameters,
            logMessages: this.logMessages
        }
    }

    protected log(status: 'info' | 'failed' | 'successful' | 'error', message: string) {
        const now: Date = new Date();
        this.loggers.forEach((logger: Logger) => {
            logger.log({time: now, status, message});
        });
    }

    public execute(callback: (err: Error | null) => void) {
        this.log('info', 'Starting ' + this.testType + ' with following parameters:');
        this.log('info',  JSON.stringify(this.parameters));
        this.executeTestScript((err: Error | null, isFinishedSuccessfuly?: boolean, failureReason?: string) => {
            if(err) {
                this.log('error', err.message);
                callback(err);
            } else {
                if (isFinishedSuccessfuly) {
                    this.log('successful', 'Test completed successfuly');
                } else {
                    this.log('failed', 'Test failed. Reason: ' + failureReason);
                }
                callback(err);
            }
        });
    }

    protected abstract executeTestScript(callback: (err: Error | null, isFinishedSuccessfuly?: boolean, failureReason?: string) => void): void;
    public abstract get testType(): TestType;
}

export default ExecutableTest;