import {Field, InputType} from "type-graphql";
import {GraphQLUpload} from "apollo-server-express";
import {Upload} from "../../types/graphql";

@InputType()
export class CreateTeamInput {
    @Field({description: "Team Name"})
    name!: string;

    @Field({description: "Team optional password", nullable: true})
    password?: string;

    @Field({description: "Team optional description", nullable: true})
    description?: string;

    @Field(() => GraphQLUpload || Boolean, {nullable: true})
    image?: Upload;
}

@InputType({description: "Informacion necesaria para unirse a un equipo."})
export class JoinTeamInput {
    @Field({description: "ID del equipo a ingresar."})
    id!: number;

    @Field(() => String, {nullable: true, description: "Contraseña del equipo a ingresar, nulo si es publico."})
    password!: string | null
}
