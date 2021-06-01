import TestScheme from './testScheme';
import Executable from '../executable/executable';
import WildcardSubscriptionTest from '../executable/wildcardSubscriptionTest';

class WildcardSubscriptionTestScheme extends TestScheme {
    public static readonly type: string = 'wildcardSubscription';

    protected constructor(id?: number) {
        super(id);
    }

    public static getInstance(id?: number): WildcardSubscriptionTestScheme {
        return new WildcardSubscriptionTestScheme(id);
    }

    public getExecutableInstance(): Executable {
        return new WildcardSubscriptionTest();
    }

    public get params(): {} {
        throw new Error("Method not implemented.");
    }

    public get type(): string {
        return WildcardSubscriptionTestScheme.type;
    }
}

export default WildcardSubscriptionTestScheme;