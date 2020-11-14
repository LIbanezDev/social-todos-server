import {User} from "../entity/User";
import {Arg, Ctx, FieldResolver, Mutation, Query, Resolver, Root} from "type-graphql";
import {AuthUser, Context} from "../types/graphql";
import jwt from 'jsonwebtoken'
import {uploadFile} from "../utils/uploads";
import {SocialRegisterInput, UserRegisterInput} from "../entity/input/UserRegister";
import {LoginResponse, RegisterResponse} from "../entity/responses/UserResponse";
import {getEncryptedCredentials, getSocialUser, validateRegister, verifyPassword} from "../utils/auth";

@Resolver(User)
export class UserResolver {

    @FieldResolver()
    age(@Root() user: User) {
        let diff = (Date.now() - user.bornDate.getTime()) / 1000;
        diff /= (60 * 60 * 24);
        return Math.abs(Math.trunc(diff / 365.25));
    }

    @Mutation(() => RegisterResponse)
    async register(@Arg('data') data: UserRegisterInput): Promise<RegisterResponse> {
        try {
            const userRegistered = await User.findOne({where: {email: data.email}})
            if (userRegistered) return {ok: false, msg: "El email ya existe!"}
            const errors = validateRegister(data)
            if (errors.length > 0) {
                return {ok: false, msg: "No se ha podido registrar el usuario, revise los campos.", errors}
            }
            const {password, salt} = getEncryptedCredentials(data.password)
            const imageURL = await uploadFile(data.image, 'users')
            const user = await User.save(Object.assign(new User(), {
                ...data,
                password,
                salt,
                image: imageURL
            }))
            return {ok: true, msg: "Registrado satisfactoriamente!", user}
        } catch (e: unknown) {
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
            const token = jwt.sign(payload, process.env.JWT_SECRET as string, {
                expiresIn: 60 * 60 * 24 * 7
            })

            return {ok: true, token, msg: "Login exitoso, el token de acceso ha sido concedido.", user: userDB}
        } catch (e: unknown) {
            return {ok: false, msg: "Error interno"}
        }
    }

    @Query(() => User, {nullable: true})
    async me(@Ctx() ctx: Context): Promise<User | null> {
        return ctx.user?.id
            ?
            await User.findOne(ctx.user?.id, {relations: ['sentMessages', 'receivedMessages']}) || null
            :
            null
    }

    @Query(() => [User])
    users(@Ctx() ctx: Context): Promise<User[]> {
        return User.createQueryBuilder('user')
            .leftJoinAndSelect('user.sentMessages', 'sentMessage')
            .leftJoinAndSelect('user.receivedMessages', 'receivedMessage')
            .getMany()
    }


    @Mutation(() => LoginResponse)
    async loginWithToken(@Arg('data') data: SocialRegisterInput): Promise<LoginResponse> {
        const newUser: Partial<User> = await getSocialUser(data.token, data.type)
        const userRegistered = await User.findOne({where: {email: newUser.email}})
        let payload: AuthUser = {
            id: 0,
            roles: [],
            name: ""
        };
        if (userRegistered) {
            if (userRegistered.github || userRegistered.google) {
                payload = {
                    id: userRegistered.id,
                    name: userRegistered.name,
                    roles: ["USER"]
                }
            } else {
                return {
                    ok: false,
                    msg: `El email ${newUser.email} ya ha sido registrado!`,
                }
            }
        } else {
            const credentials = getEncryptedCredentials('_', true)
            const user = await User.save(Object.assign(new User(), {
                ...newUser,
                ...credentials
            }))
            payload = {
                id: user.id,
                name: user.name,
                roles: ["USER"]
            }
        }
        return {
            ok: true,
            msg: "Bienvenido a social todos",
            token: jwt.sign(payload, process.env.JWT_SECRET as string, {
                expiresIn: 60 * 60 * 24 * 7
            })
        }
    }
}
