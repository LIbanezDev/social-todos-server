import { Field, ObjectType } from 'type-graphql';
import { IMutationResponse } from '../Shared/IMutationResponse';
import { Team } from './Team';
import PaginatedResponse from '../Shared/IPaginatedResponse';

@ObjectType({ implements: IMutationResponse })
export class TeamResponse extends IMutationResponse {
	@Field({ nullable: true })
	team?: Team;
}

@ObjectType()
export class TeamPaginatedResponse extends PaginatedResponse(Team) {}
