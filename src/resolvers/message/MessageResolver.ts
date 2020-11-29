import { Arg, Authorized, Ctx, Int, Mutation, PubSub, PubSubEngine, Query, Resolver } from 'type-graphql';
import { Message } from '../../entity/Message/Message';
import { AuthContext, Context } from '../../types/graphql';
import { User } from '../../entity/User/User';
import { MessageResponse } from '../../entity/Message/MessageResponse';
import { NOTIFICATIONS_TOPIC } from '../notifications/NotificationResolver';

@Resolver(Message)
export class MessageResolver {
	@Authorized()
	@Mutation(() => MessageResponse)
	async enviarMensaje(
		@PubSub() pubSub: PubSubEngine,
		@Ctx() ctx: AuthContext,
		@Arg('to') to: number,
		@Arg('message') message: string
	): Promise<MessageResponse> {
		const messageReceiver = await User.findOne(to);
		if (!messageReceiver)
			return {
				ok: false,
				msg: 'Receptor invalido!',
				errors: [{ msg: 'No existe', path: 'to' }],
			};
		const sender = await User.findOneOrFail(ctx.user.id);
		const newMessageDB = await Message.create({
			sender,
			receiver: messageReceiver,
			content: message,
			date: new Date(),
		}).save();
		const payload: Partial<Message> = {
			id: newMessageDB.id,
			date: newMessageDB.date,
			content: newMessageDB.content,
			receiver: messageReceiver,
			sender,
		};
		await pubSub.publish(NOTIFICATIONS_TOPIC.NEW_MESSAGE, payload);
		return {
			ok: true,
			msg: 'Mensaje enviado!',
			message: newMessageDB,
		};
	}

	@Authorized()
	@Query(() => [Message])
	async myChat(@Ctx() ctx: Context, @Arg('with', () => Int) withID: number) {
		return Message.createQueryBuilder('message')
			.leftJoinAndSelect('message.receiver', 'receiver')
			.leftJoinAndSelect('message.sender', 'sender')
			.where('(receiver.id = :myId AND sender.id = :withId) OR (sender.id = :myId AND receiver.id = :withId)', {
				myId: ctx.user?.id,
				withId: withID,
			})
			.orderBy('message.date', 'ASC')
			.getMany();
	}
}
