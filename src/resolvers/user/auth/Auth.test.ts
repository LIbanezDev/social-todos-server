import Database from '../../../config/Database';
import { createClient } from '../../../utils/test/test-utils';
import { gql } from 'apollo-server-express';
import faker from 'faker';
import { UserRegisterInput } from '../../../entity/User/UserRegisterInput';
import { calculateAge } from '../UserResolver';

const register = gql`
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

const fakeUser: UserRegisterInput = {
    name: faker.name.firstName(),
    email: faker.internet.email(),
    password: faker.internet.password(),
    bornDate: new Date('01/18/2001'),
    description: faker.lorem.text(),
};

describe('Auth', () => {

    afterEach(async () => {
        await Database.clearEntities();
        await Database.closeConnection();
    });

    beforeEach(async () => {
        await Database.createConnection(true);
    });

	it('should calculate age from a date', () => {
		const age = calculateAge(fakeUser.bornDate.getTime());
		expect(age).toBe(19);
	});

	it('should register a user', async () => {
		const { mutate } = await createClient();
		const { data } = await mutate({
			mutation: register,
			variables: {
				data: fakeUser,
			},
		});
		expect(data.register.user).toBe({ id: '1', name: fakeUser.name, description: fakeUser.description, age: 19 });
	});

});
