import {Field, ObjectType} from "type-graphql";
import {IMutationResponse} from "../interfaces/IMutationResponse";
import {Team} from "../Team";
import PaginatedResponse from "../interfaces/IPaginatedResponse";


@ObjectType({implements: IMutationResponse})
export class TeamResponse extends IMutationResponse {
    @Field({nullable: true})
    team?: Team
}

@ObjectType()
export class TeamPaginatedResponse extends PaginatedResponse(Team){}

