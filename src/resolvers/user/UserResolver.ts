import {User} from "../../entity/User";
import {Arg, Ctx, FieldResolver, Query, Resolver, Root} from "type-graphql";
import {Context} from "../../types/graphql";

@Resolver(User)
export class UserResolver {

    @FieldResolver()
    age(@Root() user: User) {
        let diff = (Date.now() - user.bornDate.getTime()) / 1000;
        diff /= (60 * 60 * 24);
        return Math.abs(Math.trunc(diff / 365.25));
    }

    @Query(() => User, {nullable: true, description: "Get user by id. If you want to see your own info set id = -1"})
    async user(@Ctx() ctx: Context, @Arg('id') id: number): Promise<Partial<User> | null> {
        if (id === -1) {
            if (!ctx.user) {
                return null
            }
        }
        const idToSearch = id === -1 ? ctx.user?.id : id
        const user = await User.createQueryBuilder('user')
            .where('user.id = :id', {id: idToSearch})
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
