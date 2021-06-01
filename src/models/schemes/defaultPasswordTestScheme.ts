import TestScheme from './testScheme';
import Executable from '../executable/executable';
import DefaultPasswordTest from '../executable/defaultPasswordTest';

class DefaultPasswordTestScheme extends TestScheme {
    public static readonly type: string = 'defaultPassword';

    protected constructor(id?: number) {
        super(id);
    }

    public static getInstance(id?: number): DefaultPasswordTestScheme {
        return new DefaultPasswordTestScheme(id);
    }

    public getExecutableInstance(): Executable {
        return new DefaultPasswordTest();
    }

    public get params(): {} {
        throw new Error("Method not implemented.");
    }

    public get type(): string {
        return DefaultPasswordTestScheme.type;
    }
}

export default DefaultPasswordTestScheme;