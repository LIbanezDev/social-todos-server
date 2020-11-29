import { Field, ObjectType } from 'type-graphql';
import { IMutationResponse } from '../Shared/IMutationResponse';
import { Message } from './Message';

@ObjectType({ implements: IMutationResponse })
export class MessageResponse extends IMutationResponse {
	@Field({ nullable: true })
	message?: Message;
}
