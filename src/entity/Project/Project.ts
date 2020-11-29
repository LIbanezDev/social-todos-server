import { BaseEntity, Entity, Column, PrimaryGeneratedColumn, ManyToOne, OneToMany } from 'typeorm';
import { Field, ID, ObjectType } from 'type-graphql';
import { User } from '../User/User';
import { Team } from '../Team/Team';
import { KeyWord } from '../KeyWord/KeyWord';
import { ProjectToKeyWord } from './ProjectToKeyWord';
import { UserToProject } from '../User/UserToProject';
import { Todo } from '../Todo/Todo';
import { Message } from '../Message/Message';

@Entity({ name: 'projects' })
@ObjectType()
export class Project extends BaseEntity {
	@Field(() => ID)
	@PrimaryGeneratedColumn()
	id!: number;

	@Field()
	@Column({ type: 'varchar', length: 100 })
	name!: string;

	@Column()
	teamId!: number;

	@Field()
	@Column({ type: 'varchar', length: 500 })
	description!: string;

	@Field(() => User)
	@ManyToOne(() => Team, team => team.projects)
	team!: Team;

	@Field(() => String, { nullable: true })
	@Column({ length: 180, nullable: true, type: 'varchar' })
	image?: string | null;

	@Field(() => [KeyWord])
	@OneToMany(() => ProjectToKeyWord, kw => kw.project)
	keywords!: KeyWord[];

	@Field(() => [UserToProject])
	@OneToMany(() => UserToProject, utp => utp.project)
	users!: UserToProject[];

	@Field(() => [Message])
	@OneToMany(() => Message, msg => msg.project)
	messages!: Message[];

	@Field(() => [Todo])
	@OneToMany(() => Todo, td => td.project)
	todos!: Todo[];
}
