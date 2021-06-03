import TestScheme from "./testScheme";

class TestSuiteScheme {
    public name: string;
    public testSchemes: TestScheme<any>[];
    public id?: number;

    constructor(name: string, id?: number) {
        this.name = name;
        this.id = id;
        this.testSchemes = [];
    }
}

export default TestSuiteScheme;