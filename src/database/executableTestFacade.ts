import ExecutableTest from "../models/executable/executableTest";
import DatabaseWrapper from "./databaseWrapper";

class ExecutableTestFacade {
    public update(id: number, test: ExecutableTest<any>, callback: (err: Error | null) => void): void {
        DatabaseWrapper.getDatabase().then((db) => {
            const sql: string = `UPDATE tests SET testType = ?, parameters = ?, logMessages = ? WHERE id = ?`;
            db.run(sql, [test.testType, JSON.stringify(test.parameters), JSON.stringify(test.logMessages), id], (err: Error) => {
                if (err) {
                    callback(err);
                } else {
                    callback(null);
                }
            });
        });
    }
}

export default ExecutableTestFacade;