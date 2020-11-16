import {Arg, Authorized, Ctx, Mutation, Query, Resolver} from "type-graphql";
import {Team} from "../entity/Team";
import {CreateTeamInput} from "../entity/input/TeamInput";
import {UserToTeam} from "../entity/UserToTeam";
import {AuthContext} from "../types/graphql";
import {TeamResponse} from "../entity/responses/TeamResponse";


@Resolver(Team)
export class TeamResolver {

    @Query(() => [Team], {description: "Get Teams!"})
    teams() {
        return Team.find({relations: ['users', 'users.user']})
    }

    @Query(() => Team, {nullable: true, description: "Get One Team by team id param"})
    async team(@Arg('id') id: number): Promise<Team | null> {
        return await Team.findOne({where: {id}, relations: ['users', 'users.user']}) || null
    }

    @Authorized()
    @Mutation(() => TeamResponse)
    async joinTeam(@Arg('id', {description: "Team ID"}) id: number, @Ctx() ctx: AuthContext): Promise<TeamResponse> {
        try {
            const userExist = await UserToTeam.findOne({where: {teamId: id, userId: ctx.user.id}})
            if (userExist) return {ok: false, msg: "Ya eres parte del equipo!", errors: [{path: "id", msg: "Duplicado"}]}
            const team = await Team.findOne({where: {id}})
            if (!team) return {ok: false, msg: "El equipo no existe!", errors: [{path: "id", msg: "No existe"}]}
            await UserToTeam.create({userId: ctx.user.id, teamId: id, userIsAdmin: false}).save()
            return {ok: true, msg: "Bienvenido a tu nuevo equipo: " + team.name, team}
        } catch (e: unknown) {
            return {ok: false, msg: JSON.stringify(e)}
        }
    }

    @Authorized()
    @Mutation(() => TeamResponse)
    async createTeam(@Arg('data') data: CreateTeamInput, @Ctx() ctx: AuthContext): Promise<TeamResponse> {
        try {
            const newTeam = await Team.create({...data}).save()
            await UserToTeam.create({userId: ctx.user.id, team: newTeam, userIsAdmin: true}).save()
            return {ok: true, msg: "Equipo Creado", team: newTeam}
        } catch (e: unknown) {
            return {ok: false, msg: JSON.stringify(e)}
        }
    }
}

