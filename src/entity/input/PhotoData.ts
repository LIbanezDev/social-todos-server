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
}
