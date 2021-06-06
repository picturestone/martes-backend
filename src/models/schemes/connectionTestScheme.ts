import ConnectionTest from '../executable/connectionTest';
import ExecutableTest from '../executable/executableTest';
import ConnectionTestParameters from '../testparameters/connectionTestParameters';
import TestType from '../testtype';
import TestScheme from './testScheme';

class ConnectionTestScheme extends TestScheme<ConnectionTestParameters> {
    public static readonly testType: TestType = TestType.Connection;

    public get testType(): TestType {
        return ConnectionTestScheme.testType;
    }

    public getExecutableTest(): ExecutableTest<ConnectionTestParameters> {
        const parametersShallowCopy = Object.assign({}, this.parameters);
        return new ConnectionTest(parametersShallowCopy);
    }
}

export default ConnectionTestScheme;