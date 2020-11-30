import faker from 'faker';
import {calculateAge} from '../../../../resolvers/user/UserResolver';
import {Connection} from 'typeorm/index';
import {testDbConn} from '../../../../utils/test/testDbConn';
import {graphCall} from '../../../../utils/test/testGraphQlCall';

let conn: Connection;
beforeAll(async () => {
	conn = await testDbConn();
});
afterAll(async () => {
	await conn.close();
});

const register = `
	mutation register($data: UserRegisterInput!) {
		register(data: $data) {
			ok
			msg
			errors {
				msg
				path
			}
			user {
				id
				name
				email
				description
				age
			}
		}
	}
`;

/*const login = gql`
	mutation login($email: String!, $pass: String!) {
		login(email: $email, password: $pass) {
			ok
			msg
			token
			errors {
				msg
				path
			}
		}
	}
`;*/

const fakeUser = {
	name: faker.name.firstName(1) + ' ' + faker.name.lastName(1),
	email: faker.internet.email(),
	password: faker.internet.password(),
	bornDate: new Date('01/18/2001').toISOString(),
	description: faker.lorem.text(),
};

describe('[Auth] Resolver', () => {
	it('should calculate the years from a date to now', () => {
		const age = calculateAge(new Date(fakeUser.bornDate).getTime());
		expect(age).toBe(19);
	});

	it('should register a user', async () => {
		const { data } = await graphCall({
			source: register,
			variableValues: {
				data: fakeUser,
			},
		});
		expect(data?.register.user).toMatchObject({ name: fakeUser.name, description: fakeUser.description, age: 19 });
	});
});
