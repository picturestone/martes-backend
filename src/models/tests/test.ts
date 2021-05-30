abstract class Test {
    abstract execute(callback: (isSuccessful: boolean, message?: string) => any): void;
}

export default Test;