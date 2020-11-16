import {BaseEntity, Column, Entity, OneToMany, PrimaryGeneratedColumn} from "typeorm";
import {User} from "./User";
import {UserToTeam} from "./UserToTeam";
import {Field, ObjectType} from "type-graphql";

@ObjectType()
@Entity({name: 'teams'})
export class Team extends BaseEntity {

    @Field()
    @PrimaryGeneratedColumn()
    id!: number

    @Field()
    @Column({nullable: false})
    name!: string

    @Column({nullable: true})
    @Field({nullable: true})
    password?: string

    @Field(() => [UserToTeam])
    @OneToMany(() => UserToTeam, users => users.team)
    users!: UserToTeam[]
}
