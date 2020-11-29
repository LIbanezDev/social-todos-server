import { Storage, StorageOptions } from '@google-cloud/storage';
import { Upload } from '../types/graphql';
import { JWTInput } from 'google-auth-library';

const gcpCredentials = process.env.CREDS;

if (!gcpCredentials) {
	throw new Error('CREDS NOT DEFINED');
}
const keys: JWTInput = JSON.parse(gcpCredentials);

const storageOptions: StorageOptions = {
	projectId: keys.project_id,
	credentials: keys,
};

const storage = new Storage(storageOptions);

const bucket = storage.bucket('social_todos');

export async function uploadFileToGCP(imagePromise: Upload | undefined, folder: string): Promise<string | null> {
	if (!imagePromise) {
		return null;
	}
	const image = await imagePromise;
	return new Promise(resolve => {
		const fileName = `${folder}/${new Date().getTime()}`;
		image
			.createReadStream()
			.pipe(
				bucket.file(fileName).createWriteStream({
					resumable: false,
					gzip: true,
				})
			)
			.on('finish', () => resolve(fileName))
			.on('error', () => resolve(null));
	});
}
