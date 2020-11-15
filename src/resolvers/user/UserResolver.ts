import {User} from "../../entity/User";
import {Authorized, Ctx, FieldResolver, Query, Resolver, Root} from "type-graphql";
import {AuthContext, Context} from "../../types/graphql";

@Resolver(User)
export class UserResolver {

    @FieldResolver()
    age(@Root() user: User) {
        let diff = (Date.now() - user.bornDate.getTime()) / 1000;
        diff /= (60 * 60 * 24);
        return Math.abs(Math.trunc(diff / 365.25));
    }

    @Authorized()
    @Query(() => User, {nullable: true})
    async me(@Ctx() ctx: AuthContext): Promise<Partial<User> | null> {
        const user = await User.createQueryBuilder('user')
            .where('user.id = :id', {id: ctx.user.id})
            .leftJoinAndSelect('user.teams', 'teams')
            .leftJoinAndSelect('teams.team', 'team')
            .leftJoinAndSelect('user.sentFriendRequests', 'sentRequests', 'sentRequests.friendshipState = :c', {c: false})
            .leftJoinAndSelect('user.receivedFriendRequests', 'receivedRequests', 'receivedRequests.friendshipState = :t', {t: true})
            .leftJoinAndSelect('sentRequests.receiver', 'receiver')
            .leftJoinAndSelect('receivedRequests.sender', 'sender')
            .getOne()
        if (!user) return null
        const friends = [...user.sentFriendRequests.map(u => u.receiver), ...user.receivedFriendRequests.map(u => u.sender)]
        return {...user, friends}
    }

    @Query(() => [User])
    users(@Ctx() ctx: Context): Promise<User[]> {
        return User.createQueryBuilder('user')
            .leftJoinAndSelect('user.sentMessages', 'sentMessage')
            .leftJoinAndSelect('user.receivedMessages', 'receivedMessage')
            .getMany()
    }
}
