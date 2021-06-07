import ExecutableTest from "../models/executable/executableTest";
import Logger from "./logger";
import LogMessage from "./logMessage";
import { socket } from "../index";

class SocketLogger implements Logger {
    private forTest: ExecutableTest<any>;

    constructor(forTest: ExecutableTest<any>) {
        this.forTest = forTest;
    }

    log(logMessage: LogMessage): void {
        socket.emit('log', { testId: this.forTest.id, logMessage});
    }
}

export default SocketLogger;