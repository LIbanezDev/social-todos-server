import {BaseEntity, Column, Entity, ManyToOne, PrimaryGeneratedColumn} from "typeorm";
import {User} from "./User";
import {Field, ID, ObjectType} from "type-graphql";

@ObjectType({description: 'Mensajes enviados entre los usuarios.'})
@Entity({name: 'messages'})
export class Message extends BaseEntity {
    @Field(() => ID)
    @PrimaryGeneratedColumn()
    id!: number

    @Field()
    @Column()
    date!: Date

    @Field()
    @Column()
    content!: string

    @Field(() => User)
    @ManyToOne(() => User, sender => sender.sentMessages)
    sender!: User;

    @Field(() => User)
    @ManyToOne(() => User, receiver => receiver.receivedMessages)
    receiver!: User;
}
