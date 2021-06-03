import TestScheme from './testScheme';
import WildcardSubscriptionTestParameters from '../testparameters/wildcardSubscriptionTestParameters';
import TestType from '../testtype';
import WildcardSubscriptionTest from '../executable/wildcardSubscriptionTest';
import ExecutableTest from '../executable/executableTest';

class WildcardSubscriptionTestScheme extends TestScheme<WildcardSubscriptionTestParameters> {
    public static readonly testType: TestType = TestType.Connection;

    public get testType(): TestType {
        return WildcardSubscriptionTestScheme.testType;
    }

    public generateExecutableTest(): ExecutableTest<WildcardSubscriptionTestParameters> {
        const parametersShallowCopy = Object.assign({}, this.parameters);
        return new WildcardSubscriptionTest(parametersShallowCopy);
    }
}

export default WildcardSubscriptionTestScheme;