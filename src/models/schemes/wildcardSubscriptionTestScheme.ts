import TestScheme from './testScheme';
import mqtt, { Client } from 'mqtt';
import crypto from 'crypto';

class WildcardSubscriptionTestScheme extends TestScheme {
    public static readonly type: string = 'wildcardSubscription';

    protected constructor(id?: number) {
        super(id);
    }

    public static getInstance(id?: number): WildcardSubscriptionTestScheme {
        return new WildcardSubscriptionTestScheme(id);
    }

    public get params(): {} {
        throw new Error("Method not implemented.");
    }

    public get type(): string {
        return WildcardSubscriptionTestScheme.type;
    }
}

export default WildcardSubscriptionTestScheme;