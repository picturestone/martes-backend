import Executable from "./executable";

class TestSuite {
    public name: string;
    public tests: Executable[];
    public id?: number;

    constructor(name: string, id?: number) {
        this.name = name;
        this.id = id;
        this.tests = [];
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