import {User} from "../entity/User";
import {Arg, Ctx, Mutation, Query, Resolver} from "type-graphql";
import {AuthUser, Context, Upload} from "../types/graphql";
import jwt from 'jsonwebtoken'
import {GraphQLUpload} from "apollo-server-express";
import {uploadFile} from "../utils/uploads";
import {UserRegisterInput} from "../entity/input/UserRegister";
import {LoginResponse, RegisterResponse} from "../entity/responses/UserResponse";
import {getEncryptedCredentials, validateRegister, verifyPassword} from "../utils/auth";

@Resolver(User)
export class UserResolver {

    @Mutation(() => RegisterResponse)
    async register(@Arg('data') data: UserRegisterInput): Promise<RegisterResponse> {
        try {
            const errors = validateRegister(data)
            if (errors.length > 0) {
                return {ok: false, msg: "No se ha podido registrar el usuario, revise los campos.", errors}
            }
            const {password, salt} = getEncryptedCredentials(data.password)
            const user = await User.save(Object.assign(new User(), {...data, password, salt}))
            return {ok: true, msg: "Registrado satisfactoriamente!", user}
        } catch (e) {
            if (e.errno === 1062) { // Email already exists
                return {ok: false, msg: "El email ya existe!"}
            }
            return {ok: false, msg: "Error interno, intente mas tarde"}
        }
    }

    @Mutation(() => LoginResponse)
    async login(@Arg('email') email: string, @Arg('password') pass: string): Promise<LoginResponse> {
        try {
            const loginFailed = {
                ok: false,
                msg: "Usuario o contrasena incorrectos",
                errors: [{path: "password y/o email", msg: "No validas"}]
            }
            const userDB = await User.findOne({
                where: {
                    email
                }
            })
            if (!userDB) return loginFailed

            const passwordMatches = verifyPassword({
                encryptedPassword: userDB.password, salt: userDB.salt, inputPassword: pass
            })
            if (!passwordMatches) return loginFailed
            const payload: AuthUser = {
                id: userDB.id,
                name: userDB.name,
                roles: ["USER"]
            }
            const token = jwt.sign(payload, 'TypeGraphQL')
            return {ok: true, token, msg: "Login exitoso, el token de acceso ha sido concedido.", user: userDB}
        } catch (e) {
            return {ok: false, msg: "Error interno"}
        }
    }

    @Query(() => User, {nullable: true})
    async me(@Ctx() ctx: Context): Promise<User | null> {
        return ctx.user?.id
            ?
            await User.findOne(ctx.user?.id, {relations: ['photos', 'sentMessages', 'receivedMessages']}) || null
            :
            null
    }

    @Query(() => [User])
    users(@Ctx() ctx: Context): Promise<User[]> {
        return User.createQueryBuilder('user')
            .leftJoinAndSelect('user.photos', 'photo')
            .leftJoinAndSelect('user.sentMessages', 'sentMessage')
            .leftJoinAndSelect('user.receivedMessages', 'receivedMessage')
            .getMany()
    }

    @Mutation(() => Boolean)
    async uploadFile
    (@Arg('file', () => GraphQLUpload || Boolean) image: Upload): Promise<Boolean> {
        return uploadFile(image, 'types')
    }

}
