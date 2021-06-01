import Executable from "../executable/executable";

abstract class TestScheme {
    public id?: number;

    constructor(id?: number) {
        this.id = id;
    }

    public abstract get params(): {};
    public abstract get type(): string;
    public abstract getExecutableInstance(): Executable;
}

export default TestScheme;