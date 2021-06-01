abstract class TestScheme {
    public id?: number;

    constructor(id?: number) {
        this.id = id;
    }

    public abstract execute(callback: (isSuccessful: boolean, message?: string) => any): void;
    public abstract get params(): {};
    public abstract get type(): string;
}

export default TestScheme;