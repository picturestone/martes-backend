import ExecutableTest from "./executableTest";

class TestSuite {
    public name: string;
    public tests: ExecutableTest<any>[];
    public id: number | undefined;

    constructor(name: string, id?: number) {
        this.name = name;
        this.id = id;
        this.tests = [];
    }

    public execute() {
        this.tests.forEach((test: ExecutableTest<any>) => {
            test.execute((err: Error | null) => {
                if(err) {
                    console.log(err.message)
                }
            });
        });
    }
}

export default TestSuite;