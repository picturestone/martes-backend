import ExecutableTestFacade from "../database/executableTestFacade";
import ExecutableTest from "../models/executable/executableTest";
import Logger from "./logger";
import LogMessage from "./logMessage";

class DatabaseLogger implements Logger {
    private forTest: ExecutableTest<any>;

    constructor(forTest: ExecutableTest<any>) {
        this.forTest = forTest;
    }

    log(logMessage: LogMessage): void {
        this.forTest.logMessages.push(logMessage);
        if (this.forTest.id) {
            new ExecutableTestFacade().update(this.forTest.id, this.forTest, (err) => {
                if (err) {
                    console.log(err?.message);
                }
            });
        } else {
            console.log(new Error('Cannot save log message for test that has no database entry.'));
        }
    }
}

export default DatabaseLogger;