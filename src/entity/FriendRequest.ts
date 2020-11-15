import {Column, Entity, PrimaryGeneratedColumn, BaseEntity} from "typeorm";
import {ManyToOne} from "typeorm/index";
import {User} from "./User";
import {Field, ObjectType} from "type-graphql";


@ObjectType({description:"Solicitudes de amistad entre usuarios"})
@Entity({name: "friends"})
export class FriendRequest extends BaseEntity {
    @Field()
    @PrimaryGeneratedColumn()
    id!: number

    @Column()
    senderId!: number

    @Column()
    receiverId!: number

    @Field()
    @Column({default: false})
    friendshipState!: boolean

    @Field()
    @ManyToOne(() => User, user => user.sentFriendRequests)
    sender!: User

    @Field()
    @ManyToOne(() => User, user => user.receivedFriendRequests)
    receiver!: User
}
