import {Field, InterfaceType, ObjectType} from "type-graphql";

@ObjectType()
export class MutationError {
    @Field({nullable: true})
    path!: string

    @Field({nullable: true})
    msg!: string
}

interface Error {
    path?: string,
    msg?: string
}

@InterfaceType()
export abstract class IMutationResponse {
    @Field()
    ok!: boolean

    @Field({nullable: true})
    msg!: string

    @Field(type => MutationError,{nullable: true})
    errors!: Error[]
}
