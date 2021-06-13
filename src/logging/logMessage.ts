interface LogMessage {
    id: number,
    time: Date,
    status: 'info' | 'failed' | 'successful' | 'error',
    message: string
}

export default LogMessage;