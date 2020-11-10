import {BaseEntity, Column, OneToMany, PrimaryGeneratedColumn, Entity} from "typeorm";
import {User} from "./User";
import {UserToTeam} from "./UserToTeam";
import {Field, ObjectType} from "type-graphql";

@ObjectType()
@Entity()
export class Team extends BaseEntity {
    @PrimaryGeneratedColumn()
    id!: number

    @Field()
    @Column()
    name!: string

    @Field(() => [User])
    @OneToMany(() => UserToTeam, users => users.team)
    users!: User[]
}
