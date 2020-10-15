import {Field, ObjectType} from "type-graphql";
import {IMutationResponse} from "../interfaces/IMutationResponse";
import {Photo} from "../Photo";

@ObjectType({implements: IMutationResponse})
export class PhotoResponse extends IMutationResponse {
    @Field({nullable: true})
    photo!: Photo
}

@ObjectType({implements: IMutationResponse})
export class PhotosResponse extends IMutationResponse {
    @Field(type => [Photo])
    photos!: Photo[]
}

