import {Arg, Mutation, Query, Resolver} from "type-graphql";
import {Photo} from "../entity/Photo";
import {PhotoData, PhotoEditData} from "../entity/input/PhotoData";
import {User} from "../entity/User";
import {PhotoResponse} from "../entity/responses/PhotoResponse";


@Resolver(Photo)
export class PhotoResolver {


    @Query(() => [Photo])
    async photos(): Promise<Photo[]> {
        return Photo.find({
            relations: ['user']
        })
    }


    @Query(() => Photo, {nullable: true})
    async photo(@Arg("ID") id: number): Promise<Photo | null> {
        const photo = await Photo.findOne(id, {
            relations: ['user']
        })
        return photo || null
    }

    @Mutation(() => PhotoResponse)
    async createPhoto(@Arg("data") newPhotoData: PhotoData): Promise<PhotoResponse> {
        const newPhoto = new Photo()
        Object.assign(newPhotoData, newPhoto)
        const photoOwner = await User.findOne(newPhotoData.actorID)
        if (!photoOwner) {
            return {
                ok: false,
                msg: "Actor no existe!",
                errors: [{path: "actorID", msg: "No existe"}]
            }
        }
        newPhoto.user = photoOwner
        const photo = await Photo.save(newPhoto)
        return {
            ok: true,
            msg: "Foto creada con exito",
            photo
        }
    }

    @Mutation(() => PhotoResponse)
    async deletePhoto(@Arg("ID") id: number): Promise<PhotoResponse> {
        const photo = await Photo.findOne(id, {
            relations: ['user']
        })
        if (!photo) {
            return {
                ok: false,
                msg: "Foto no existe",
                errors: [{msg: "No existe", path: "ID"}]
            }
        }
        await Photo.delete(id)
        return {
            ok: true,
            msg: "Foto eliminada con exito",
            photo
        }
    }

    @Mutation(() => PhotoResponse)
    async editPhoto
    (@Arg("ID") id: number, @Arg("data") data: PhotoEditData): Promise<PhotoResponse> {
        const response = await Photo.update(id, data)
        if (!response) {
            return {
                ok: false,
                msg: "Error interno, intente mas tarde",
            }
        }

        // @ts-ignore
        if (response.affected == 0) {
            return {
                ok: false,
                msg: "Foto no encontrada",
                errors: [{path: "ID", msg: "No encontrado"}]
            }
        }

        const updatedPhoto = await Photo.findOne(id, {
            relations: ['user']
        })

        return {
            ok: true,
            msg: "Foto actualizada con exito",
            photo: updatedPhoto
        }
    }
}
