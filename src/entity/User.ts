import {Column, Entity, OneToMany, PrimaryGeneratedColumn, BaseEntity} from "typeorm";
import {Photo} from "./Photo";
import {Field, ID, ObjectType} from "type-graphql";
import {Message} from "./Message";

@ObjectType({description: 'Registered users'})
@Entity({name: 'users'})
export class User extends BaseEntity {

    @Field(() => ID)
    @PrimaryGeneratedColumn()
    id!: number;

    @Field()
    @Column({length: 100, nullable: false})
    name!: string

    @Field()
    @Column()
    age!: number

    @Field()
    @Column({length: 150, unique: true, nullable: false})
    email!: string

    @Column({length: 100, nullable: false})
    password!: string

    @Column({length: 30, nullable: false})
    salt!: string

    @Column({length: 80, nullable: true, default: "no_image.png"})
    image!: string

    @Field(() => [Photo])
    @OneToMany(() => Photo, photo => photo.user)
    photos!: Photo[]

    @Field(() => [Message])
    @OneToMany(() => Message, sender => sender.sender)
    sentMessages!: Message[];

    @Field(() => [Message])
    @OneToMany(() => Message, receiver => receiver.receiver)
    receivedMessages!: Message[];
}
