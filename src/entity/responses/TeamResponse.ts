import {Field, ObjectType} from "type-graphql";
import {IMutationResponse} from "../interfaces/IMutationResponse";
import {Team} from "../Team";


@ObjectType({implements: IMutationResponse})
export class TeamResponse extends IMutationResponse {
    @Field({nullable: true})
    team?: Team
}
