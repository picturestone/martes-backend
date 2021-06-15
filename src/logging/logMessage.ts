interface LogMessage {
    id: number,
    time: Date,
    status: 'running' | 'failed' | 'successful' | 'error',
    message: string
}

export default LogMessage;