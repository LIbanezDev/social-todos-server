import {Authorized, Resolver, ResolverFilterData, Root, Subscription} from "type-graphql";
import {Message} from "../entity/Message";
import {Context} from "../types/graphql";
import {MESSAGE_TOPICS} from "./MessageResolver";

@Resolver()
export class SubsResolver {

    @Authorized()
    @Subscription(() => Message, {
        topics: MESSAGE_TOPICS.NEW_MESSAGE,
        filter: ({payload, context}: ResolverFilterData<Message>) => {
            return payload.receiver.id === (context as Context).user?.id;
        },
    })
    esperarNuevosMensajes(@Root() payload: Message) {
        return payload;
    }

}
