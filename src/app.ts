import "reflect-metadata";
import express from 'express'
import bodyParser from "body-parser";
import {createConnection} from "typeorm";
import {PhotoResolver} from "./resolvers/PhotoResolver";
import {buildSchema, ForbiddenError} from "type-graphql";
import {ApolloServer} from "apollo-server-express";
import {AuthorResolver} from "./resolvers/AuthorResolver";
import jwt from 'express-jwt';
import {authChecker} from "./auth/AuthChecker";
import {Context} from "./types/graphql";

class App {

    private readonly app: express.Application = express()
    private readonly port: string | number = process.env.PORT || 3000
    private readonly path: string = "/graphql"

    setJwtMiddleware(): void {
        this.app.use(this.path,
            jwt({
                secret: 'TypeGraphQL',
                credentialsRequired: false,
                algorithms: ['sha1', 'RS256', 'HS256'],
            })
        )
    }

    setParser(): void {
        this.app.use(bodyParser.json())
        this.app.use(bodyParser.urlencoded({extended: false}))
    }

    async getApolloGraphServer(): Promise<ApolloServer> {
        const schema = await buildSchema({
            resolvers: [PhotoResolver, AuthorResolver],
            authChecker
        });
        return new ApolloServer({
            schema,
            introspection: true,
            playground: true,
            formatError(error) {
                if (error.originalError instanceof ForbiddenError) {
                    return new Error('No estas autenticado, verifica el token de acceso.');
                }
                return error
            },
            context: ({req}: any) => {
                const context: Context = {
                    req,
                    user: req.user
                }
                return context
            }
        })
    }

    async start(): Promise<void> {
        await createConnection()
        this.setParser()
        this.setJwtMiddleware()
        const apolloServer = await this.getApolloGraphServer()
        apolloServer.applyMiddleware({app: this.app, path: this.path})
        this.app.listen(this.port, () => {
            console.log('Listening port ' + this.port)
        })
    }
}

const app = new App()
app.start()



