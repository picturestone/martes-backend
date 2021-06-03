import TestType from "../testtype";

abstract class ExecutableTest<parametersType> {
    public id?: number;
    public parameters: Readonly<parametersType>;

    constructor(parameters: parametersType, id?: number) {
        this.id = id;
        this.parameters = parameters;
    }

    abstract execute(callback: (isSuccessful: boolean, message?: string) => any): void;
    public abstract get testType(): TestType;
}

export default ExecutableTest;