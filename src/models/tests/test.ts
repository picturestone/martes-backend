abstract class Test {
    public abstract execute(callback: (isSuccessful: boolean, message?: string) => any): void;
    public abstract get params(): {};
    public abstract get type(): string;
}

export default Test;