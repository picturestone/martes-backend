import TestScheme from "../schemes/testScheme";
import TestSuiteScheme from "../schemes/testSuiteScheme";
import Executable from "./executable";

class TestSuite {
    public name: string;
    public tests: Executable[];
    public id?: number;

    constructor(testSuiteScheme: TestSuiteScheme, id?: number) {
        this.name = testSuiteScheme.name;
        this.tests = [];
        testSuiteScheme.testSchemes.forEach((testScheme: TestScheme) => {
            this.tests.push(testScheme.getExecutableInstance());
        });
    }

    public execute() {
        this.tests.forEach((test: Executable) => {
            test.execute((isSuccessful: boolean, message?: string) => {
                console.log(isSuccessful);
                console.log(message)
            });
        });
    }
}

export default TestSuite;