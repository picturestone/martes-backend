import ExecutableTest from "../executable/executableTest";
import TestType from "../testtype";

abstract class TestScheme<parametersType> {
    public id: number | undefined;
    public parameters: parametersType;

    constructor(parameters: parametersType, id?: number) {
        this.id = id;
        this.parameters = parameters;
    }

    // Custom toJSON method to include testType when converting to json. 
    toJSON() {
        return {
            id: this.id,
            testType: this.testType,
            parameters: this.parameters
        }
    }

    public abstract get testType(): TestType;
    public abstract generateExecutableTest(): ExecutableTest<parametersType>;
}

export default TestScheme;