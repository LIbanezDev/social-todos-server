import { Field, ID, ObjectType } from 'type-graphql';
import { BaseEntity, Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm/index';
import { ProjectToKeyWord } from '../Project/ProjectToKeyWord';
import { Project } from '../Project/Project';

@ObjectType()
@Entity({name: 'key_words'})
export class KeyWord extends BaseEntity {
	@Field(() => ID)
	@PrimaryGeneratedColumn()
	id!: number;

	@Field()
	@Column({ type: 'varchar', length: 50 })
	name!: string;

	@Field(() => [Project])
	@OneToMany(() => ProjectToKeyWord, kw => kw.keyWord)
	projects!: Project[];
}
