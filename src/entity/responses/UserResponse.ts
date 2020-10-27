import {Field, ObjectType} from "type-graphql";
import {IMutationResponse} from "../interfaces/IMutationResponse";
import {User} from "../User";

@ObjectType({implements: IMutationResponse})
export class RegisterResponse extends IMutationResponse {
    @Field({nullable: true})
    user?: User
}

@ObjectType({implements: IMutationResponse})
export class LoginResponse extends IMutationResponse {
    @Field({nullable: true})
    user?: User

    @Field({nullable: true})
    token?: string
}
