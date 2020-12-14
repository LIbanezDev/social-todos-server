import { User } from '../../entity/User/User';
import { Arg, Ctx, FieldResolver, Query, Resolver, Root } from 'type-graphql';
import { Context } from '../../types/types';
import faker from 'faker';
import { getEncryptedCredentials } from '../../utils/auth';
import { UserPaginatedResponse } from '../../entity/User/UserResponse';
import { Team } from '../../entity/Team/Team';
import { PaginateInput } from '../../entity/Shared/IPaginatedResponse';

export const calculateAge = (miliseconds: number) => {
	let diff = (Date.now() - miliseconds) / 1000;
	diff /= 60 * 60 * 24;
	return Math.abs(Math.trunc(diff / 365.25));
}

@Resolver(User)
export class UserResolver {
	@FieldResolver()
	age(@Root() user: User) {
		return calculateAge(user.bornDate.getTime())
	}

	@Query(() => Boolean)
	async seed() {
		const users: User[] = [];
		const teams: Team[] = [];
		for (let i = 0; i < 30; i++) {
			const { password, salt } = getEncryptedCredentials('123456');
			teams.push(
				Team.create({
					name: faker.company.companyName(),
					description: faker.lorem.text(),
					password,
					salt,
					image: 'https://picsum.photos/200/300',
				})
			);
			users.push(
				User.create({
					name: faker.name.findName(),
					email: faker.internet.email(),
					password,
					salt,
					bornDate: faker.date.past(19),
					image: 'https://picsum.photos/200/300',
				})
			);
		}
		await Promise.all([User.save(users), Team.save(teams)]);
		return true;
	}

	@Query(() => User, {
		nullable: true,
		description: 'Get user by id. If you want to see your own info set id = -1',
	})
	async user(@Ctx() ctx: Context, @Arg('id') id: number): Promise<Partial<User> | null> {
		if (id === -1) {
			if (!ctx.user) {
				return null;
			}
		}
		const idToSearch = id === -1 ? ctx.user?.id : id;
		const user = await User.createQueryBuilder('user')
			.where('user.id = :id', { id: idToSearch })
			.leftJoinAndSelect('user.teams', 'teams')
			.leftJoinAndSelect('teams.team', 'team')
			.leftJoinAndSelect('user.sentFriendRequests', 'sentRequests', 'sentRequests.friendshipState = :c', { c: true })
			.leftJoinAndSelect('user.receivedFriendRequests', 'receivedRequests', 'receivedRequests.friendshipState = :t', { t: true })
			.leftJoinAndSelect('sentRequests.receiver', 'receiver')
			.leftJoinAndSelect('receivedRequests.sender', 'sender')
			.getOne();
		if (!user) return null;
		const friends = [...user.sentFriendRequests.map(u => u.receiver), ...user.receivedFriendRequests.map(u => u.sender)];
		return { ...user, friends };
	}

	@Query(() => UserPaginatedResponse)
	async users(@Ctx() ctx: Context, @Arg('data') paginateInput: PaginateInput): Promise<UserPaginatedResponse> {
		const { cursor, pageSize } = paginateInput;
		const newLimit = pageSize + 1;
		const users = await User.createQueryBuilder('user')
			.where('user.email > :cursor', { cursor: cursor !== null ? cursor : '' })
			.orderBy('user.email')
			.leftJoinAndSelect('user.teams', 'teams')
			.leftJoinAndSelect('teams.team', 'team')
			.leftJoinAndSelect('user.sentMessages', 'sentMessage')
			.leftJoinAndSelect('user.receivedMessages', 'receivedMessage')
			.limit(newLimit)
			.getMany();
		let hasMore: boolean = true;
		if (users.length < newLimit) hasMore = false;
		return {
			hasMore,
			cursor: users[users.length - 1].email,
			items: users.slice(0, newLimit - 1),
		};
	}
}
