import {Photo} from "../Photo";
import {Field, InputType} from "type-graphql";

@InputType({description:"Informacion necesaria para agregar fotos!"})
export class PhotoData implements Partial<Photo> {
    @Field()
    name!: string

    @Field()
    description!: string

    @Field()
    filename!: string

    @Field()
    isPublished!: boolean

    @Field()
    actorID!: number

    @Field()
    views!: number
}

@InputType({description:"Informacion opcional para editar fotos!"})
export class PhotoEditData implements Partial<Photo> {
    @Field({nullable: true})
    name!: string

    @Field({nullable: true})
    description!: string

    @Field({nullable: true})
    filename!: string

    @Field({nullable: true})
    isPublished!: boolean

    @Field({nullable: true})
    actorID!: number
}
