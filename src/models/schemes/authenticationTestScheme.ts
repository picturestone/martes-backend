import TestScheme from './testScheme';
import AuthenticationTestParameters from '../testparameters/authenticationTestParameters';
import TestType from '../testtype';
import ExecutableTest from '../executable/executableTest';
import AuthenticationTest from '../executable/authenticationTest';

class AuthenticationTestScheme extends TestScheme<AuthenticationTestParameters> {
    public static readonly testType: TestType = TestType.Connection;

    public get testType(): TestType {
        return AuthenticationTestScheme.testType;
    }

    public getExecutableTest(): ExecutableTest<AuthenticationTestParameters> {
        const parametersShallowCopy = Object.assign({}, this.parameters);
        return new AuthenticationTest(parametersShallowCopy);
    }
}

export default AuthenticationTestScheme;