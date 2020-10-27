import {Arg, Authorized, Ctx, Int, Mutation, PubSub, PubSubEngine, Query, Resolver} from "type-graphql";
import {Message, MessagePayload} from "../entity/Message";
import {AuthUser, Context} from "../types/graphql";
import {User} from "../entity/User";
import {MessageResponse} from "../entity/responses/MessageResponse";

export enum MESSAGE_TOPICS {
    NEW_MESSAGE = "NEW_MESSAGE"
}

@Resolver(Message)
export class MessageResolver {

    @Authorized()
    @Mutation(() => MessageResponse)
    async enviarMensaje(
        @PubSub() pubSub: PubSubEngine,
        @Ctx() ctx: Context & { user: AuthUser },
        @Arg("to") to: number,
        @Arg("message") message: string,
    ): Promise<MessageResponse> {
        const newMessage = Object.assign(new Message(), {content: message})
        newMessage.sender = await User.findOneOrFail(ctx.user.id)
        const messageReceiver = await User.findOne(to)
        if (!messageReceiver) {
            return {ok: false, msg: "Receptor invalido!", errors: [{msg: "No existe", path: "to"}]}
        }
        newMessage.receiver = messageReceiver
        newMessage.date = new Date()
        const newMessageDB = await Message.save(newMessage)
        const payload: MessagePayload = {
            content: newMessageDB.content,
            receiverId: to,
            senderId: ctx.user.id,
        };
        await pubSub.publish(MESSAGE_TOPICS.NEW_MESSAGE, payload);
        return {
            ok: true,
            msg: "Mensaje enviado!",
            message: newMessageDB
        };
    }

    @Authorized()
    @Query(() => [Message])
    async myChat(@Ctx() ctx: Context, @Arg('with', () => Int) withID: number) {
        const messages = await Message.createQueryBuilder('message')
            .leftJoinAndSelect('message.receiver', 'receiver')
            .leftJoinAndSelect('message.sender', 'sender')
            .where('(receiver.id = :myId AND sender.id = :withId) OR (sender.id = :myId AND receiver.id = :withId)', {
                myId: ctx.user?.id,
                withId: withID
            })
            .getMany()
        console.log(messages)
        return messages
 
    }
}
