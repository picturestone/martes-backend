import TestScheme from "./testScheme";

class TestSuiteScheme {
    public name: string;
    public testSchemes: TestScheme[];
    public id?: number;

    constructor(name: string, id?: number) {
        this.name = name;
        this.id = id;
        this.testSchemes = [];
    }
}

export default TestSuiteScheme;