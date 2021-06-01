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

    public execute() {
        this.testSchemes.forEach((testScheme: TestScheme) => {
            testScheme.execute((isSuccessful: boolean, message?: string) => {
                console.log(isSuccessful);
                console.log(message)
            });
        });
    }
}

export default TestSuiteScheme;