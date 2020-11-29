import { Field, ObjectType } from 'type-graphql';
import { IMutationResponse } from '../Shared/IMutationResponse';
import { User } from './User';
import PaginatedResponse from '../Shared/IPaginatedResponse';

@ObjectType({ implements: IMutationResponse })
export class UserResponse extends IMutationResponse {
	@Field({ nullable: true })
	user?: User;
}

@ObjectType({ implements: IMutationResponse })
export class LoginResponse extends IMutationResponse {
	@Field({ nullable: true })
	user?: User;

	@Field({ nullable: true })
	token?: string;
}

@ObjectType()
export class UserPaginatedResponse extends PaginatedResponse(User) {}
