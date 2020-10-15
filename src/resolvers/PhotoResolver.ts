import {Arg, Mutation, Query, Resolver} from "type-graphql";
import {Photo} from "../entity/Photo";
import {getRepository, Repository} from "typeorm";
import {IPhotoResponse, IPhotosResponse} from "../types/api";
import {PhotoData} from "../entity/input/PhotoData";
import {Author} from "../entity/Author";
import {PhotoResponse, PhotosResponse} from "../entity/responses/PhotoResponse";


@Resolver(Photo)
export class PhotoResolver {
    constructor(private readonly photoService: Repository<Photo>) {
        this.photoService = getRepository(Photo)
    }

    @Query(returns => PhotosResponse)
    async photos(): Promise<IPhotosResponse> {
        const photos = await this.photoService.find({
            relations: ['author']
        })
        return {
            ok: true,
            photos
        }
    }

    @Query(returns => PhotoResponse)
    async photo(@Arg("ID") id: string): Promise<IPhotoResponse> {
        const photo = await this.photoService.findOne(id)
        return {
            ok: true,
            photo: photo || null
        }
    }

    @Mutation(returns => PhotoResponse)
    async createPhoto(@Arg("data") newPhotoData: PhotoData): Promise<IPhotoResponse> {
        const newPhoto = new Photo()
        newPhoto.name = newPhotoData.name
        newPhoto.description = newPhotoData.description
        newPhoto.filename = newPhotoData.filename
        newPhoto.isPublished = newPhotoData.isPublished
        const authorRepository = getRepository(Author)
        const photoOwner = await authorRepository.findOne(newPhotoData.actorID)
        if (!photoOwner) {
            return {
                ok: false, msg: "Actor no existe!", errors: [
                    {path: "actorID", msg: "No existe"}], photo: null
            }
        }
        newPhoto.author = photoOwner
        const photo = await this.photoService.save(newPhoto)
        return {
            ok: true,
            photo
        }
    }
}
