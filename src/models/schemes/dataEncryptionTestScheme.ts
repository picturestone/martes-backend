import TestScheme from './testScheme';
import mqtt, { Client } from 'mqtt';

class DataEncryptionTestScheme extends TestScheme {
    public static readonly type: string = 'dataEncryption';

    protected constructor(id?: number) {
        super(id);
    }

    public static getInstance(id?: number): DataEncryptionTestScheme {
        return new DataEncryptionTestScheme(id);
    }

    public get params(): {} {
        throw new Error("Method not implemented.");
    }

    public get type(): string {
        return DataEncryptionTestScheme.type;
    }
}

export default DataEncryptionTestScheme;