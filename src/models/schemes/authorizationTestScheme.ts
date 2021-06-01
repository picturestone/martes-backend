import TestScheme from './testScheme';
import AuthorizationTest from '../executable/authorizationTest';
import Executable from '../executable/executable';

class AuthorizationTestScheme extends TestScheme {
    public static readonly type: string = 'authorization';

    protected constructor(id?: number) {
        super(id);
    }

    public static getInstance(id?: number): AuthorizationTestScheme {
        return new AuthorizationTestScheme(id);
    }

    public getExecutableInstance(): Executable {
        return new AuthorizationTest();
    }

    public get params(): {} {
        throw new Error("Method not implemented.");
    }

    public get type(): string {
        return AuthorizationTestScheme.type;
    }
}

export default AuthorizationTestScheme;