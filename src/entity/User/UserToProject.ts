import { Field, ID, ObjectType } from 'type-graphql';
import { BaseEntity, Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { User } from './User';
import { Project } from '../Project/Project';

@ObjectType({ description: 'Entidad que relaciona projectos y usuarios' })
@Entity({ name: 'users_projects' })
export class UserToProject extends BaseEntity {
	@Field(() => ID)
	@PrimaryGeneratedColumn()
	id!: number;

	@Column()
	userId!: number;

	@Column()
	projectId!: number;

	@Field()
	@Column({ type: 'varchar', length: 40 })
	role!: string;

	@Field(() => User)
	@ManyToOne(() => User, u => u.projects)
	user!: User;

	@Field(() => Project)
	@ManyToOne(() => Project, p => p.users)
	project!: Project;
}
