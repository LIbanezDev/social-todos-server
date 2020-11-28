import {Field, InterfaceType, ObjectType} from "type-graphql";

@ObjectType()
export class MutationError {
    @Field({nullable: true})
    path!: string

    @Field({nullable: true})
    msg!: string
}



@InterfaceType()
export class IMutationResponse {
    @Field()
    ok!: boolean;

    @Field({nullable: true})
    msg?: string;

    @Field(() => [MutationError], {nullable: true})
    errors?: MutationError[]
}
