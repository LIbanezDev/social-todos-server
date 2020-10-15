import {Author} from "../entity/Author";
import {Authorized, Ctx, Query, Resolver} from "type-graphql";
import {getRepository, Repository} from "typeorm";
import {Context} from "../types/graphql";
import jsonwebtoken from 'jsonwebtoken'

@Resolver(Author)
export class AuthorResolver {
    constructor(private authorRepository: Repository<Author>) {
        this.authorRepository = getRepository(Author)
    }

    @Authorized(["ADMIN"])
    @Query(returns => [Author])
    async authors(@Ctx() ctx: Context) {
        return this.authorRepository.find({
            relations: ['photos']
        })
    }

    @Query(returns => String)
    async jwt() {
        return jsonwebtoken.sign({
            id: 1,
            name: "Lucas",
            roles: ['ADMIN']
        }, 'TypeGraphQL')
    }
}
