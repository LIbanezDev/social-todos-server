import {Authorized, Resolver, ResolverFilterData, Root, Subscription} from "type-graphql";
import {MessagePayload} from "../entity/Message";
import {Context} from "../types/graphql";
import {MESSAGE_TOPICS} from "./MessageResolver";

@Resolver()
export class SubsResolver {

    @Authorized()
    @Subscription(() => MessagePayload, {
        topics: MESSAGE_TOPICS.NEW_MESSAGE,
        filter: ({payload, context}: ResolverFilterData<MessagePayload>) => {
            return payload.receiverId === (context as Context).user?.id;
        },
    })
    esperarNuevosMensajes(@Root() {content, receiverId, senderId}: MessagePayload): MessagePayload & { date: Date } {
        return {content, senderId, receiverId, date: new Date()};
    }

}
