import validator from "validator";
import {AUTH_APPS, UserRegisterInput} from "../entity/input/UserRegisterInput";
import crypto from 'crypto'
import {MutationError} from "../entity/interfaces/IMutationResponse";
import {User} from "../entity/User";
import fetch from "node-fetch";
import {OAuth2Client} from 'google-auth-library';
import {ExpressContext} from "apollo-server-express/dist/ApolloServer";
import {AuthUser, Context} from "../types/graphql";
import {ExecutionParams} from "subscriptions-transport-ws";
import jwt from "jsonwebtoken";
import {AuthChecker} from "type-graphql";

export const validateRegister = (data: UserRegisterInput): MutationError[] => {
    const errors: MutationError[] = []
    if (validator.isEmpty(data.email) || !validator.isEmail(data.email)) {
        errors.push({msg: "No es un email valido!", path: "email"})
    }
    if (validator.isEmpty(data.name) || !validator.isLength(data.name, {min: 10, max: 100})) {
        errors.push({msg: "Tu nombre debe tener entre 10 y 100 caracteres!", path: "name"})
    }
    if (validator.isEmpty(data.password) || !validator.isLength(data.password, {min: 5, max: 30})) {
        errors.push({msg: "La contrasena debe tener entre 5 y 30 caracteres!", path: "password"})
    }

    return errors
}

export const getEncryptedCredentials = (password: string, github = false, google = false): { password: string, salt: string } => {
    const salt = crypto.randomBytes(16).toString('base64')
    let finalPass = password
    if (!process.env.GOOGLE_PASS || !process.env.GITHUB_PASS) {
        throw new Error('Variables de entorno google pass y github pass no definidas...')
    }
    if (github) finalPass = process.env.GITHUB_PASS
    if (google) finalPass = process.env.GOOGLE_PASS
    const encryptedPassword = crypto.pbkdf2Sync(
        finalPass,
        salt, 10000, 64, 'sha1')
        .toString('base64')
    return {salt, password: encryptedPassword}
}

interface IVerifyPassword {
    inputPassword: string,
    encryptedPassword: string,
    salt: string
}

export const verifyPassword = ({inputPassword, encryptedPassword, salt}: IVerifyPassword): boolean => {
    const encryptedInputPass = crypto.pbkdf2Sync(inputPassword, salt, 10000, 64, 'sha1')
        .toString('base64')
    return encryptedPassword === encryptedInputPass
}

export const getSocialUser = async (token: string, type: AUTH_APPS): Promise<Partial<User>> => {
    let socialUser: Partial<User> = {}
    if (type == 0) {
        const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
        const loginTicket = await googleClient.verifyIdToken({
            idToken: token,
            audience: process.env.GOOGLE_CLIENT_ID
        })
        const googleUser = loginTicket.getPayload()
        socialUser.email = googleUser?.email
        socialUser.name = googleUser?.name
        socialUser.image = googleUser?.picture
        socialUser.google = true
    }
    if (type == 1) {
        const userDataRes = await fetch('https://api.github.com/user', {
            headers: {
                'Authorization': `token ${token}`
            }
        })
        const githubData: { name: string, email: string, bio: string, avatar_url: string } = await userDataRes.json()

        socialUser.name = githubData.name
        socialUser.email = githubData.email
        socialUser.description = githubData.bio
        socialUser.image = githubData.avatar_url
        socialUser.github = true
    }
    socialUser.bornDate = new Date()
    return socialUser
}

export const verifyToken = (token: string): AuthUser | null => {
    try {
        return jwt.verify(token, process.env.JWT_SECRET as string) as AuthUser
    } catch (e: unknown) {
        return null
    }
}

export const tokenChecker = (context: ExpressContext): Context => {
    let user: AuthUser | null = null;

    if (context.connection) { // Websocket connection
        const connection = context.connection as ExecutionParams<{ Authorization?: string }>
        if (connection.context.Authorization) {
            user = verifyToken(connection.context.Authorization)
        }
    } else if (context.req.headers.authorization) { // HTTP connection
        user = verifyToken(context.req.headers.authorization)
    }
    return {
        req: context.req,
        user
    }
}

// Auth checker for @Authorized() typegraphql feature
export const authChecker: AuthChecker<Context> =
    ({context: {req, user}}, roles) => {
        if (!user) {
            return false
        }

        if (roles.length === 0) { // if `@Authorized()`, check only is user exist
            return true;
        }

        if (user.roles.some(role => roles.includes(role))) {
            return true
        }
        // here we can read the user from context
        // and check his permission in the db against the `roles` argument
        // that comes from the `@Authorized` decorator, eg. ["ADMIN", "MODERATOR"]
        return false; // or false if access is denied
    };
