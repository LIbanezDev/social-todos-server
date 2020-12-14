import {createConnection} from "typeorm";

export const testDbConn = (drop: boolean = false) => {
    return createConnection({
        type: "postgres",
        host: "localhost",
        port: 5432,
        username: "postgres",
        password: "123456",
        database: "social_todos_test",
        synchronize: drop,
        dropSchema: drop,
        entities: [__dirname + "/../../entity/**/*.ts"]
    });
}
