import { BaseEntity, Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { User } from '../User/User';
import { Field, ID, ObjectType } from 'type-graphql';
import { Project } from '../Project/Project';

@ObjectType({ description: 'Mensajes enviados entre los usuarios.' })
@Entity({ name: 'messages' })
export class Message extends BaseEntity {
	@Field(() => ID)
	@PrimaryGeneratedColumn()
	id!: number;

	@Field()
	@Column()
	date!: Date;

	@Field()
	@Column()
	content!: string;

	@Field(() => User)
	@ManyToOne(() => User, sender => sender.sentMessages)
	sender!: User;

	@Field(() => Project)
	@ManyToOne(() => Project, pj => pj.messages)
	project!: Project;

	@Field(() => User)
	@ManyToOne(() => User, receiver => receiver.receivedMessages)
	receiver!: User;
}
