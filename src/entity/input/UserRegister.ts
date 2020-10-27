import {Field, InputType} from "type-graphql";
import {User} from "../User";


@InputType({description: "Informacion necesaria para crear nuevos usuarios"})
export class UserRegisterInput implements Partial<User> {
    @Field({nullable: false})
    name!: string

    @Field({nullable: false})
    age!: number

    @Field({nullable: false})
    email!: string

    @Field({nullable: false})
    password!: string

    @Field({nullable:true})
    image!: string
}
