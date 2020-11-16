import {User} from "../../entity/User";
import {Arg, Authorized, Ctx, Mutation, PubSub, PubSubEngine, Query, Resolver} from "type-graphql";
import {UserResponse} from "../../entity/responses/UserResponse";
import {AuthContext} from "../../types/graphql";
import {FriendRequest} from "../../entity/FriendRequest";
import {NOTIFICATIONS_TOPIC} from "../subscriptions/SubscriptionsResolver";

@Resolver(User)
export class FriendRequestResolver {

    @Authorized()
    @Mutation(() => UserResponse)
    async sendFriendRequest(
        @PubSub() pubSub: PubSubEngine,
        @Arg('to') to: number,
        @Ctx() ctx: AuthContext
    ): Promise<UserResponse> {
        try {
            const receiver = await User.findOne({where: {id: to}})
            const sender = await User.findOne({where:{id: ctx.user.id}})
            if (!receiver) return {ok: false, msg: "Destinatario no existe", errors: [{path: "id", msg: "No existe"}]}
            const friendRequest = await FriendRequest.create({sender, receiver}).save()
            await pubSub.publish(NOTIFICATIONS_TOPIC.NEW_FRIEND_REQUEST, friendRequest)
            return {ok: true, msg: "Solicitud enviada correctamente a " + receiver.name, user: receiver}
        } catch (e: unknown) {
            return {ok: false, msg: JSON.stringify(e)}
        }
    }

    @Authorized()
    @Query(() => [FriendRequest])
    async myFriendRequests(@Ctx() ctx: AuthContext) {
        return FriendRequest.find({relations: ['sender'], where: {receiverId: ctx.user.id}})
    }

    @Authorized()
    @Mutation(() => Boolean)
    async answerFriendRequest(
        @Ctx() ctx: AuthContext,
        @Arg('requestId') requestId: number,
        @Arg('accept') accept: boolean
    ): Promise<boolean> {
        try {
            const friendRequest = await FriendRequest.findOne({where: {id: requestId}})
            if (!friendRequest) return false
            if (accept) {
                friendRequest.friendshipState = true
                friendRequest.save()
            } else {
                await friendRequest.remove()
            }
            return true
        } catch (e: unknown) {
            return false
        }
    }
}
