import {createConnection, getConnection} from "typeorm";

class Database {
	public static async createConnection() {
		return createConnection()
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
