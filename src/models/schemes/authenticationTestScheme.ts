import TestScheme from './testScheme';
import mqtt, { Client } from 'mqtt';

class AuthenticationTestScheme extends TestScheme {
    public static readonly type: string = 'authentication';

    protected constructor(id?: number) {
        super(id);
    }

    public static getInstance(id?: number): AuthenticationTestScheme {
        return new AuthenticationTestScheme(id);
    }

    public get params(): {} {
        throw new Error("Method not implemented.");
    }

    public get type(): string {
        return AuthenticationTestScheme.type;
    }
}

export default AuthenticationTestScheme;