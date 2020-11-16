import {gql} from "apollo-server-express";

export const schemaQuery = gql`
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
`
