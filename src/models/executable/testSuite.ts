import TestScheme from "../schemes/testScheme";
import TestSuiteScheme from "../schemes/testSuiteScheme";
import ExecutableTest from "./executableTest";

class TestSuite {
    public name: string;
    public tests: ExecutableTest<any>[];
    public id?: number;

    constructor(testSuiteScheme: TestSuiteScheme, id?: number) {
        this.name = testSuiteScheme.name;
        this.tests = [];
        testSuiteScheme.testSchemes.forEach((testScheme: TestScheme<any>) => {
            this.tests.push(testScheme.generateExecutableTest());
        });
    }

    public execute() {
        this.tests.forEach((test: ExecutableTest<any>) => {
            test.execute((isSuccessful: boolean, message?: string) => {
                console.log(isSuccessful);
                console.log(message)
            });
        });
    }
}

export default TestSuite;