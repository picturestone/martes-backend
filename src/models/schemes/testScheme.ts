import ExecutableTest from "../executable/executableTest";
import TestType from "../testtype";

abstract class TestScheme<parametersType> {
    public id?: number;
    public parameters: parametersType;

    constructor(parameters: parametersType, id?: number) {
        this.id = id;
        this.parameters = parameters;
    }

    public abstract get testType(): TestType;
    public abstract generateExecutableTest(): ExecutableTest<parametersType>;
}

export default TestScheme;