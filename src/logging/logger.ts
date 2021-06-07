import LogMessage from "./logMessage";

interface Logger {
    log(logMessage: LogMessage): void;
}

export default Logger;