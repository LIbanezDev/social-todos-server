import { Arg, Authorized, Ctx, FieldResolver, Mutation, Query, Resolver, Root } from 'type-graphql';
import { Team } from '../../entity/Team/Team';
import { CreateTeamInput, JoinTeamInput } from '../../entity/Team/TeamInput';
import { UserToTeam } from '../../entity/User/UserToTeam';
import { AuthContext } from '../../types/graphql';
import { TeamPaginatedResponse, TeamResponse } from '../../entity/Team/TeamResponse';
import { uploadFileToGCP } from '../../utils/uploads';
import { getEncryptedCredentials, verifyPassword } from '../../utils/auth';
import { TeamPaginatedInput } from '../../entity/Team/TeamInput';

@Resolver(Team)
export class TeamResolver {
	@FieldResolver()
	isPublic(@Root() team: Team) {
		return team.password === null;
	}

	@Query(() => [Team], { description: 'Get Teams!' })
	teams(@Arg('offset', { defaultValue: 0 }) offset: number, @Arg('limit', { defaultValue: 6 }) limit: number) {
		return Team.find({
			relations: ['users', 'users.user'],
			take: limit,
			skip: offset,
		});
	}

	@Query(() => TeamPaginatedResponse, {
		description: 'Get paginated teams',
	})
	async teamsPaginated(@Arg('data') paginateInput: TeamPaginatedInput): Promise<TeamPaginatedResponse> {
		const { pageSize, cursor } = paginateInput;
		const newLimit = pageSize + 1;
		let unfilteredteams = await Team.createQueryBuilder('team').where('team.name > :cursor', {
			cursor: cursor !== null ? cursor : '',
		});
		if (paginateInput.onlyPublic !== null && paginateInput.onlyPublic) {
			unfilteredteams.andWhere('team.password IS NULL');
		}
		if (paginateInput.name !== null) {
			unfilteredteams.andWhere('LOWER(team.name) LIKE :name', {
				name: `%${paginateInput.name.toLowerCase()}%`,
			});
		}
		const teams = await unfilteredteams.orderBy('team.name').limit(newLimit).getMany();

		let hasMore: boolean = true;
		if (teams.length < newLimit) hasMore = false;
		return {
			hasMore,
			cursor: teams.length > 0 ? teams[teams.length - 1].name : null,
			items: hasMore ? teams.slice(0, teams.length - 1) : teams,
		};
	}

	@Query(() => Team, {
		nullable: true,
		description: 'Get One Team by team id param',
	})
	async team(@Arg('id') id: number): Promise<Team | null> {
		return (
			(await Team.findOne({
				where: { id },
				relations: ['users', 'users.user'],
			})) || null
		);
	}

	@Authorized()
	@Mutation(() => TeamResponse)
	async joinTeam(@Arg('data') data: JoinTeamInput, @Ctx() ctx: AuthContext): Promise<TeamResponse> {
		try {
			const userExist = await UserToTeam.findOne({
				where: { teamId: data.id, userId: ctx.user.id },
			});
			if (userExist)
				return {
					ok: false,
					msg: 'Ya eres parte del equipo!',
					errors: [{ path: 'id', msg: 'Duplicado' }],
				};
			const team = await Team.findOne({ where: { id: data.id } });
			if (!team)
				return {
					ok: false,
					msg: 'El equipo no existe!',
					errors: [{ path: 'id', msg: 'No existe' }],
				};
			if (team.password && team.salt) {
				if (!data.password) {
					return {
						ok: false,
						msg: 'Debe ingresar contraseña!',
						errors: [{ path: 'password', msg: 'Vacio.' }],
					};
				}
				const isValid = verifyPassword({
					inputPassword: data.password,
					salt: team.salt,
					encryptedPassword: team.password,
				});
				if (!isValid) {
					return {
						ok: false,
						msg: 'Contraseña incorrecta!',
						errors: [{ path: 'password', msg: 'No coincide.' }],
					};
				}
			}
			await UserToTeam.create({
				userId: ctx.user.id,
				teamId: data.id,
				userIsAdmin: false,
			}).save();
			return {
				ok: true,
				msg: 'Bienvenido a tu nuevo equipo: ' + team.name,
				team,
			};
		} catch (e: unknown) {
			return { ok: false, msg: JSON.stringify(e) };
		}
	}

	@Authorized()
	@Mutation(() => TeamResponse)
	async createTeam(@Arg('data') data: CreateTeamInput, @Ctx() ctx: AuthContext): Promise<TeamResponse> {
		try {
			const imageURL = await uploadFileToGCP(data.image, 'teams');
			let pass: null | string = null;
			let _salt: null | string = null;
			if (data.password) {
				const { password, salt } = getEncryptedCredentials(data.password);
				pass = password;
				_salt = salt;
			}
			const newTeam = await Team.create({
				...data,
				password: pass,
				salt: _salt,
				image: imageURL,
			}).save();
			await UserToTeam.create({
				userId: ctx.user.id,
				team: newTeam,
				userIsAdmin: true,
			}).save();
			return { ok: true, msg: 'Equipo Creado', team: newTeam };
		} catch (e: unknown) {
			return { ok: false, msg: JSON.stringify(e) };
		}
	}
}
