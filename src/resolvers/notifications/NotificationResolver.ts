import { Authorized, createUnionType, Resolver, ResolverFilterData, Root, Subscription } from 'type-graphql';
import { Message } from '../../entity/Message/Message';
import { FriendRequest } from '../../entity/FriendRequest/FriendRequest';
import { AuthContext } from '../../types/types';

export enum NOTIFICATIONS_TOPIC {
	NEW_MESSAGE = 'NM',
	NEW_FRIEND_REQUEST = 'NFR',
}

const NotificationsUnion = createUnionType({
	name: 'NotificationSubscription', // the name of the GraphQL union
	types: () => [Message, FriendRequest] as const, // function that returns tuple of object types classes
	resolveType: value => {
		if ('content' in value) {
			return Message;
		}
		if ('friendshipState' in value) {
			return FriendRequest;
		}
		return undefined;
	},
});

@Resolver()
export class NotificationResolver {
	@Authorized()
	@Subscription(() => NotificationsUnion, {
		topics: [NOTIFICATIONS_TOPIC.NEW_MESSAGE, NOTIFICATIONS_TOPIC.NEW_FRIEND_REQUEST],
		filter: ({ payload, context }: ResolverFilterData<typeof NotificationsUnion, {}, AuthContext>) => {
			return payload.receiver.id === context.user.id;
		},
	})
	waitNotifications(@Root() payload: typeof NotificationsUnion): typeof NotificationsUnion {
		return payload;
	}
}
