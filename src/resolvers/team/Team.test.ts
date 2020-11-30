import Database from '../../config/Database';
import { createClient, createTestDbUser, customUserData } from '../../utils/test/test-utils';
import { gql } from 'apollo-server-express';
import faker from 'faker';

afterEach(async () => {
	await Database.clearEntities();
	await Database.closeConnection();
});

beforeEach(async () => {
	await Database.createConnection(true);
	await createTestDbUser();
});

afterAll(async () => {
	await Database.closeConnection();
});

const getTeams = gql`
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

const seedDB = gql`
	query {
		seed
	}
`;

const getTeamById = gql`
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

const createTeam = gql`
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
		const { mutate, query } = await createClient(true);
		const { data } = await mutate({
			mutation: createTeam,
			variables: {
				data: {
					name: companyName,
					description: companyDescription,
					password: companyPassword,
				},
			},
		});
		expect(data.createTeam.ok).toBeTruthy();
		expect(data.createTeam.errors).toBeNull();

		const { data: dataFindOne } = await query({
			query: getTeamById,
			variables: {
				id: parseInt(data?.createTeam.team.id),
			},
		});

		expect(dataFindOne.team).toMatchObject({ id: '1', name: companyName, description: companyDescription });
		expect(dataFindOne.team.isPublic).toBeFalsy();
		expect(dataFindOne.team.users[0].user).toEqual({ id: '1', ...customUserData });
		expect(dataFindOne.team.users[0].userIsAdmin).toBeTruthy();
	});

	test('should create public team', async () => {
		const { mutate, query } = await createClient(true);
		const { data } = await mutate({
			mutation: createTeam,
			variables: {
				data: {
					name: companyName,
					description: companyDescription,
				},
			},
		});
		expect(data.createTeam.ok).toBeTruthy();
		expect(data.createTeam.errors).toBeNull();

		const { data: dataFindOne } = await query({
			query: getTeamById,
			variables: {
				id: parseInt(data?.createTeam.team.id),
			},
		});
		expect(dataFindOne.team).toMatchObject({ id: '1', name: companyName, description: companyDescription });
		expect(dataFindOne.team.isPublic).toBeTruthy();
		expect(dataFindOne.team.users[0].user).toEqual({ id: '1', ...customUserData });
		expect(dataFindOne.team.users[0].userIsAdmin).toBeTruthy();
	});

	test('should create DB with 30 teams and 30 users', async () => {
		const { query } = await createClient();
		const { data: dataSeed } = await query({
			query: seedDB,
		});
		const { data: dataTeams } = await query({
			query: getTeams,
			variables: {
				pageSize: 40,
			},
		});
		const {
			teamsPaginated: { items, cursor, hasMore },
		} = dataTeams;
		expect(dataSeed).toBeTruthy();
		expect(items).toHaveLength(30);
		expect(cursor).toEqual(items[items.length - 1].name);
		expect(hasMore).toBeFalsy();
	});
});
