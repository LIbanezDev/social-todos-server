import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { Field, ID, ObjectType, registerEnumType } from 'type-graphql';
import { Project } from '../Project/Project';
import { ManyToOne } from 'typeorm/index';

export enum TODO_STATE {
	NOT_STARTED = 'NT',
	IN_PROGRESS = 'IP',
	COMPLETED = 'CT',
}

registerEnumType(TODO_STATE, {
	name: 'TODO_STATE', // this one is mandatory
	description: 'El estado de las todos, hay 3 posibles: Aun no empezada - En progreso - Finalizada',
});

@ObjectType()
@Entity({ name: 'todos' })
export class Todo extends BaseEntity {
	@Field(() => ID)
	@PrimaryGeneratedColumn()
	id!: number;

	@Column()
	assignedToId!: number;

	@Column()
	projectId!: number;

	@Field()
	@Column({ type: 'varchar', length: 100 })
	content!: string;

	@Field(() => TODO_STATE)
	@Column({ type: 'enum', enum: TODO_STATE, default: TODO_STATE.NOT_STARTED })
	state!: TODO_STATE;

	@Field(() => Project)
	@ManyToOne(() => Project, pj => pj.todos)
	project!: Project;
}
