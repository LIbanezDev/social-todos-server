import {Entity, PrimaryGeneratedColumn, Column, ManyToOne, BaseEntity} from "typeorm";
import {User} from "./User";
import {Team} from "./Team";


@Entity({name:"user_teams"})
export class UserToTeam extends BaseEntity {
    @PrimaryGeneratedColumn()
    userToTeamId!: number;

    @Column()
    userId!: number;

    @Column()
    teamId!: number;

    @Column({default: false})
    userIsAdmin!: boolean

    @ManyToOne(() => User, user => user.teams)
    user!: User

    @ManyToOne(() => Team, team => team.users)
    team!: Team
}
