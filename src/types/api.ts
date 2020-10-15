import {Photo} from "../entity/Photo";
import {Author} from "../entity/Author";

export interface IApiResponse {
    ok: boolean,
    msg?: string,
    errors?: {
        path?: string,
        msg: string
    }[]
}

export interface IPhotosResponse extends IApiResponse {
    photos: Photo[] | []
}

export interface IPhotoResponse extends IApiResponse {
    photo: Photo | null
}

export interface IAuthorGetResponse extends IApiResponse {
    authors: Author[] | []
}
