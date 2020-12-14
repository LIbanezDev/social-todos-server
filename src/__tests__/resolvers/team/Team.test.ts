import {createTestDbUser, graphCall} from '../../../utils/test/testGraphQlCall';
import faker from 'faker';
import {Connection} from 'typeorm/index';
import {testDbConn} from '../../../utils/test/testDbConn';

let conn: Connection;
beforeAll(async () => {
	conn = await testDbConn();
});
afterAll(async () => {
	await conn.close();
});

const getTeams = `
	query getTeamsPaginated($pageSize: Int!) {
		teamsPaginated(data: { pageSize: $pageSize }) {
			cursor
			hasMore
			items {
				id
				name
			}
		}
	}
`;

const seedDB = `
	query {
		seed
	}
`;

const getTeamById = `
	query teamById($id: Float!) {
		team(id: $id) {
			id
			name
			description
			isPublic
			users {
				userIsAdmin
				user {
					id
					name
					email
				}
			}
		}
	}
`;

const createTeam = `
	mutation createTeam($data: CreateTeamInput!) {
		createTeam(data: $data) {
			ok
			msg
			errors {
				msg
				path
			}
			team {
				id
				name
				description
			}
		}
	}
`;

const companyName = faker.company.companyName();
const companyDescription = faker.lorem.text();
const companyPassword = faker.internet.password();

describe('CRUD Teams', () => {
	test('should create private team', async () => {
		const testUser = await createTestDbUser();
		const { data } = await graphCall({
			source: createTeam,
			variableValues: {
				data: {
					name: companyName,
					description: companyDescription,
					password: companyPassword,
				},
			},
			customContext: {
				user: {
					id: testUser.id,
					name: testUser.name,
					roles: ['ADMIN'],
				},
			},
		});

		expect(data?.createTeam.ok).toBeTruthy();
		expect(data?.createTeam.errors).toBeNull();

		const { data: dataFindOne } = await graphCall({
			source: getTeamById,
			variableValues: {
				id: parseInt(data?.createTeam.team.id),
			},
		});

		expect(dataFindOne?.team).toMatchObject({ name: companyName, description: companyDescription });
		expect(dataFindOne?.team.isPublic).toBeFalsy();
		expect({ ...testUser, id: testUser.id.toString() }).toMatchObject(dataFindOne?.team.users[0].user);
		expect(dataFindOne?.team.users[0].userIsAdmin).toBeTruthy();
	});

	test('should create public team', async () => {
		const testUser = await createTestDbUser();
		const { data } = await graphCall({
			source: createTeam,
			variableValues: {
				data: {
					name: companyName,
					description: companyDescription,
				},
			},
			customContext: {
				user: {
					id: testUser.id,
					name: testUser.name,
					roles: ['ADMIN'],
				},
			},
		});
		expect(data?.createTeam.ok).toBeTruthy();
		expect(data?.createTeam.errors).toBeNull();

		const { data: dataFindOne } = await graphCall({
			source: getTeamById,
			variableValues: {
				id: parseInt(data?.createTeam.team.id),
			},
		});
		expect(dataFindOne?.team).toMatchObject({ name: companyName, description: companyDescription });
		expect(dataFindOne?.team.isPublic).toBeTruthy();
		expect({ ...testUser, id: testUser.id.toString() }).toMatchObject(dataFindOne?.team.users[0].user);
		expect(dataFindOne?.team.users[0].userIsAdmin).toBeTruthy();
	});

	test('should create 30 teams and 30 users', async () => {
		const { data: dataSeed } = await graphCall({
			source: seedDB,
		});
		const { data: dataTeams } = await graphCall({
			source: getTeams,
			variableValues: {
				pageSize: 40,
			},
		});
		expect(dataSeed).toBeTruthy();
		expect(dataTeams?.teamsPaginated.items.length).toBeGreaterThan(29);
	});
});
