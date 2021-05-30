interface Test {
    execute(callback: (isSuccessful: boolean, message?: string) => any): void;
}

export default Test;