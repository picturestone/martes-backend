import TestScheme from './testScheme';
import AuthorizationTestParameters from '../testparameters/authorizationTestParameters';
import TestType from '../testtype';
import ExecutableTest from '../executable/executableTest';
import AuthorizationTest from '../executable/authorizationTest';

class AuthorizationTestScheme extends TestScheme<AuthorizationTestParameters> {
    public static readonly testType: TestType = TestType.Authorization;

    public get testType(): TestType {
        return AuthorizationTestScheme.testType;
    }

    public getExecutableTest(): ExecutableTest<AuthorizationTestParameters> {
        const parametersShallowCopy = Object.assign({}, this.parameters);
        return new AuthorizationTest(parametersShallowCopy);
    }
}

export default AuthorizationTestScheme;