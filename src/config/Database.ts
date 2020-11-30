import {createConnection, getConnection} from "typeorm";

class Database {
	public static async createConnection(test: boolean = false) {
		return !test  ? await createConnection()
			:
			await createConnection({
				type: "postgres",
				host: "localhost",
				port: 5432,
				username: "postgres",
				password: "123456",
				database: "social_todos_test",
				synchronize: true,
				dropSchema: true,
				entities: [__dirname + "/../entity/**/*.ts"]
			});
	}
	public static async closeConnection() {
		await getConnection().close();
	}
	public static async clearEntities() {
		const connection = getConnection();
		const entities = connection.entityMetadatas;
		for (const entity of entities) {
			const repository = connection.getRepository(entity.name);
			await repository.query(`DELETE FROM ${entity.tableName}`);
		}
	}
}

export default Database;
