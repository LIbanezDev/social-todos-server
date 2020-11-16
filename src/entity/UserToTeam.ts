import {Entity, PrimaryGeneratedColumn, Column, ManyToOne, BaseEntity} from "typeorm";
import {User} from "./User";
import {Team} from "./Team";
import {Field, ObjectType} from "type-graphql";

@ObjectType()
@Entity({name:"users_teams"})
export class UserToTeam extends BaseEntity {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column()
    userId!: number;

    @Column()
    teamId!: number;

    @Field()
    @Column({default: false})
    userIsAdmin!: boolean

    @Field(() => User)
    @ManyToOne(() => User, user => user.teams)
    user!: User

    @Field(() => Team)
    @ManyToOne(() => Team, team => team.users)
    team!: Team
}
