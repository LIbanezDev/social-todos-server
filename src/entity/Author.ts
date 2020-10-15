import {Entity, PrimaryGeneratedColumn, Column, OneToMany} from "typeorm";
import {Photo} from "./Photo";
import {Field, ID, ObjectType} from "type-graphql";

@ObjectType()
@Entity()
export class Author {

    @Field(type => ID)
    @PrimaryGeneratedColumn()
    id!: number;

    @Field()
    @Column({
        length: 100
    })
    name!: string

    @Field(type => [Photo])
    @OneToMany(() => Photo, photo => photo.author)
    photos!: Photo[]
}
