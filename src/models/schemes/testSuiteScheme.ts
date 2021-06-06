import ExecutableTest from "../executable/executableTest";
import TestSuite from "../executable/testSuite";
import TestScheme from "./testScheme";

class TestSuiteScheme {
    public name: string;
    public testSchemes: TestScheme<any>[];
    public id: number | undefined;

    constructor(name: string, id?: number) {
        this.name = name;
        this.id = id;
        this.testSchemes = [];
    }

    public getTestSuite(): TestSuite {
        const testSuite: TestSuite = new TestSuite(this.name);
        const tests: ExecutableTest<any>[] = [];
        this.testSchemes.forEach((testScheme: TestScheme<any>) => {
            tests.push(testScheme.getExecutableTest());
        });
        testSuite.tests = tests;
        return testSuite;
    }
}

export default TestSuiteScheme;