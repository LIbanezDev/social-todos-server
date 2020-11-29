import {BaseEntity, Column, Entity, ManyToOne, PrimaryGeneratedColumn} from 'typeorm';
import {Project} from './Project';
import {Field, ObjectType} from 'type-graphql';
import {KeyWord} from '../KeyWord/KeyWord';

@ObjectType()
@Entity({ name: 'projects_key_words' })
export class ProjectToKeyWord extends BaseEntity {
	@PrimaryGeneratedColumn()
	id!: number;

	@Column()
	projectId!: number;

	@Column()
	keyWordId!: number;

	@Field(() => Project)
	@ManyToOne(() => Project, project => project.keywords)
	project!: Project;

	@Field(() => KeyWord)
	@ManyToOne(() => KeyWord, keyWord => keyWord.projects)
	keyWord!: KeyWord;
}
