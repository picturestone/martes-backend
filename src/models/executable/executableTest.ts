import TestType from "../testtype";

abstract class ExecutableTest<parametersType> {
    public id: number | undefined;
    public parameters: Readonly<parametersType>;

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

    public abstract execute(callback: (isSuccessful: boolean, message?: string) => any): void;
    public abstract get testType(): TestType;
}

export default ExecutableTest;