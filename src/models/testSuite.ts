import Test from "./tests/test";

class TestSuite {
    private _name: string;
    private _tests: Test[];

    constructor(name: string) {
        this._name = name;
        this._tests = [];
    }

    public execute() {
        this._tests.forEach((test: Test) => {
            test.execute((isSuccessful: boolean, message?: string) => {
                console.log(isSuccessful);
                console.log(message)
            });
        });
    }

    public get name(): string {
        return this._name;
    }

    public set name(_name: string) {
        this._name = _name;
    }

    public get tests(): Test[] {
        return this._tests;
    }

    public set tests(_tests: Test[]) {
        this._tests = _tests;
    }
}

export default TestSuite;