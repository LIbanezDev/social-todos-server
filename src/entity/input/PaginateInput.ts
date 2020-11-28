import {Field, InputType, Int} from "type-graphql";


@InputType()
export class PaginateInput {
    @Field(() => Int)
    pageSize!: number

    @Field(() => String, {defaultValue: null})
    cursor!: string | null
}
