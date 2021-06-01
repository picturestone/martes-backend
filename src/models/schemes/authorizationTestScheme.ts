import TestScheme from './testScheme';
import mqtt, { Client } from 'mqtt';

class AuthorizationTestScheme extends TestScheme {
    public static readonly type: string = 'authorization';

    protected constructor(id?: number) {
        super(id);
    }

    public static getInstance(id?: number): AuthorizationTestScheme {
        return new AuthorizationTestScheme(id);
    }

    public get params(): {} {
        throw new Error("Method not implemented.");
    }

    public get type(): string {
        return AuthorizationTestScheme.type;
    }
}

export default AuthorizationTestScheme;