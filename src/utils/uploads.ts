import {Storage} from "@google-cloud/storage";
import {Upload} from "../types/graphql";

const storage = new Storage({
    keyFilename: 'myprojects-290805-4d3a2e94d573.json',
    projectId: 'my-proyects'
})

const bucket = storage.bucket('social-todos');

export async function uploadFile(image: Upload, folder: string): Promise<boolean> {
    return new Promise((resolve, reject) => {
        image.createReadStream()
            .on("data", buffer => {
                const blob = bucket.file(`${folder}/${image.filename.replace(/ /g, "_")}`)
                const blobStream = blob.createWriteStream({
                    resumable: true,
                })
                blobStream
                    .on('finish', () => {
                        resolve(true)
                    })
                    .on('error', () => {
                        reject(false)
                    })
                    .end(buffer)
            })
    })
}
