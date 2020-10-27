import {BaseEntity, Column, Entity, ManyToOne, PrimaryGeneratedColumn} from "typeorm";
import {User} from "./User";
import {Field, ID, ObjectType} from "type-graphql";

@ObjectType()
@Entity({name: "photos"})
export class Photo extends BaseEntity {

    @Field(() => ID)
    @PrimaryGeneratedColumn()
    id!: number;

    @Field()
    @Column({length: '100'})
    name!: string;

    @Field()
    @Column("text")
    description!: string;

    @Field()
    @Column()
    filename!: string;

    @Field({defaultValue: 1})
    @Column("double")
    views!: number;

    @Field()
    @Column()
    isPublished!: boolean;

    @Field(() => User, {nullable: true})
    @ManyToOne(() => User, user => user.photos)
    user!: User
}
