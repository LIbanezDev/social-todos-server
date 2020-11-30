import { ApolloServerTestClient, createTestClient } from 'apollo-server-testing';
import { buildSchema } from 'type-graphql';
import { ApolloServer } from 'apollo-server-express';
import {authChecker, getEncryptedCredentials} from '../auth';
import { config } from 'dotenv';
import { AuthContext } from '../../types/graphql';
import {User} from "../../entity/User/User";
import {ExpressContext} from "apollo-server-express/dist/ApolloServer";
config();

export const customUserData = {
	name: "Lucas Test Client",
	email: "lucas.test@socialtodos.cl"
}

export const createTestDbUser = async () => {
    const {password, salt} = getEncryptedCredentials("123456")
    await User.create({
        ...customUserData,
        password,
        salt,
        bornDate: "01/18/2001"
    }).save()
}

export const createClient = async (authContext: boolean = false): Promise<ApolloServerTestClient> => {
	const schema = await buildSchema({
		resolvers: [__dirname + '/../../resolvers/**/*.{ts,js}'],
		authChecker,
		validate: false,
	});
	return createTestClient(
		new ApolloServer({
			schema,
			context: (ctx): ExpressContext | AuthContext => {
				if (!authContext) {
					return ctx;
				}
				return { req: ctx.req, user: {id: 1, ...customUserData, roles: ['ADMIN']} };
			},
		})
	);
};
