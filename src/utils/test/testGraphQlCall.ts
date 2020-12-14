import {getEncryptedCredentials} from '../auth';
import {User} from '../../entity/User/User';
import {createSchema} from '../schema';
import {graphql, GraphQLSchema} from 'graphql';
import {Maybe} from 'type-graphql';
import {config} from 'dotenv';
import {AuthUser} from "../../types/types";
import faker from 'faker'

config();


export const createTestDbUser = async () => {
	const { password, salt } = getEncryptedCredentials('123456');
	const customUserData = {
		name: faker.name.firstName(1) + " " + faker.name.lastName(1),
		email: faker.internet.email(),
	};
	return await User.create({
		...customUserData,
		password,
		salt,
		bornDate: '01/18/2001',
	}).save()
};

interface Options {
	source: string;
	variableValues?: Maybe<{
		[key: string]: any;
	}>;
	customContext?: {user: AuthUser}
}

let schema: GraphQLSchema;

export const graphCall = async ({ source, variableValues, customContext }: Options) => {
	if (!schema) {
		schema = await createSchema();
	}
	return graphql({
		contextValue: customContext,
		schema,
		source,
		variableValues,
	});
};
