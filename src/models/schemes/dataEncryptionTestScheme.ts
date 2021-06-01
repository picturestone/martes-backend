import TestScheme from './testScheme';
import Executable from '../executable/executable';
import DataEncryptionTest from '../executable/dataEncryptionTest';

class DataEncryptionTestScheme extends TestScheme {
    public static readonly type: string = 'dataEncryption';

    protected constructor(id?: number) {
        super(id);
    }

    public static getInstance(id?: number): DataEncryptionTestScheme {
        return new DataEncryptionTestScheme(id);
    }

    public getExecutableInstance(): Executable {
        return new DataEncryptionTest();
    }

    public get params(): {} {
        throw new Error("Method not implemented.");
    }

    public get type(): string {
        return DataEncryptionTestScheme.type;
    }
}

export default DataEncryptionTestScheme;