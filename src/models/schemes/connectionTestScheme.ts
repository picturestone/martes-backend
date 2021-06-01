import TestScheme from './testScheme';
import Executable from '../executable/executable';
import ConnectionTest from '../executable/connectionTest';

class ConnectionTestScheme extends TestScheme {
    public static readonly type: string = 'connection';

    protected host: string;
    protected port: number;

    protected constructor(host: string, port: number, id?: number) {
        super(id);
        this.host = host;
        this.port = port;
    }

    public static getInstance(params: any, id?: number): ConnectionTestScheme {
        const host: string = params.host;
        const port: number = params.port;
        if(!host || !port) {
            throw new Error('Missing parameters to create test of type ' + this.type);
        }

        return new ConnectionTestScheme(host, port, id);
    }

    public getExecutableInstance(): Executable {
        return new ConnectionTest(this.host, this.port);
    }

    public get params(): {} {
        return {
            host: this.host,
            port: this.port
        }
    }

    public get type(): string {
        return ConnectionTestScheme.type;
    }
}

export default ConnectionTestScheme;