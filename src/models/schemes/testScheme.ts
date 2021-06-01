abstract class TestScheme {
    public id?: number;

    constructor(id?: number) {
        this.id = id;
    }

    public abstract get params(): {};
    public abstract get type(): string;
}

export default TestScheme;