import { Column, Entity, PrimaryGeneratedColumn, BaseEntity } from 'typeorm';
import { ManyToOne } from 'typeorm/index';
import { User } from '../User/User';
import { Field, ID, ObjectType } from 'type-graphql';

@ObjectType({ description: 'Amistad entre usuarios' })
@Entity({ name: 'friends' })
export class FriendRequest extends BaseEntity {
	@Field(() => ID)
	@PrimaryGeneratedColumn()
	id!: number;

	@Column()
	senderId!: number;

	@Column()
	receiverId!: number;

	@Field()
	@Column({ default: false })
	friendshipState!: boolean;

	@Field(() => User)
	@ManyToOne(() => User, user => user.sentFriendRequests)
	sender!: User;

	@Field(() => User)
	@ManyToOne(() => User, user => user.receivedFriendRequests)
	receiver!: User;
}
