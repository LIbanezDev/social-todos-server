import {BaseEntity, Column, Entity, OneToMany, PrimaryGeneratedColumn} from "typeorm";
import {Field, ID, ObjectType} from "type-graphql";
import {Message} from "./Message";
import {UserToTeam} from "./UserToTeam";
import {Team} from "./Team";

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
    age!: number

    @Column()
    bornDate!: Date

    @Field()
    @Column({default: '', length: 500})
    description!: string

    @Field()
    @Column({default: false})
    google!: boolean

    @Field()
    @Column({default: false})
    github!: boolean

    @Field()
    @Column({length: 150, unique: true, nullable: false})
    email!: string

    @Column({length: 100, nullable: false})
    password!: string

    @Column({length: 30, nullable: false})
    salt!: string

    @Field({nullable: true})
    @Column({length: 120, nullable: true})
    image?: string

    @Field(() => [Message])
    @OneToMany(() => Message, sender => sender.sender)
    sentMessages!: Message[];

    @Field(() => [Message])
    @OneToMany(() => Message, receiver => receiver.receiver)
    receivedMessages!: Message[];

    @Field(() => [Team])
    @OneToMany(() => UserToTeam, teams => teams.user)
    teams!: Team[];
}
