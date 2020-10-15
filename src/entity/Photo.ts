import {Column, Entity, ManyToOne, PrimaryGeneratedColumn} from "typeorm";
import {Author} from "./Author";
import {Authorized, Field, ID, ObjectType} from "type-graphql";

@ObjectType()
@Entity()
export class Photo {

    @Field(type => ID)
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

    @Field()
    @Column("double")
    views!: number;

    @Field()
    @Column()
    isPublished!: boolean;

    @Field(type => Author, {nullable: true})
    @ManyToOne(() => Author, author => author.photos)
    author!: Author
}
