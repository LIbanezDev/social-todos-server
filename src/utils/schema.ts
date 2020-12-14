import {GraphQLSchema} from "graphql";
import {buildSchema} from "type-graphql";
import {authChecker} from "./auth";

export const schemaQuery = `
    {
        __schema {
            queryType {
                fields {
                    name
                }
            }
            mutationType {
                fields {
                    name
                }
            }
            subscriptionType {
                fields {
                    name
                }
            }
            types {
                kind
                name
                fields {
                    name
                }
            }
        }
    }
`;

export const createSchema = async (): Promise<GraphQLSchema> => {
    return buildSchema({
        resolvers: [__dirname + '/../resolvers/**/*.{ts,js}'],
        authChecker,
        validate: false,
    });
};
