import { Arg, Query, Resolver } from 'type-graphql';
import { Giphy } from '../../entity/Temporal/Giphy';
import { HTTPCache, RequestOptions, RESTDataSource } from 'apollo-datasource-rest';

interface GifResponse {
	data: Giphy[];
}

@Resolver(Giphy)
export class GiphyResolver extends RESTDataSource {
	constructor() {
		super();
		this.baseURL = 'https://api.giphy.com/v1/gifs/';
		this.httpCache = new HTTPCache();
	}

	willSendRequest(request: RequestOptions): void {
		request.params.append('api_key', process.env.GIPHY_KEY as string);
	}

	@Query(() => [Giphy], { description: 'Trending giphpys', nullable: true })
	async trendingGifs(
		@Arg('limit', { defaultValue: 25 }) limit: number,
		@Arg('offset', { defaultValue: 0 }) offset: number
	): Promise<Giphy[]> {
		const res = await this.get<GifResponse>('trending', { limit, offset });
		return res.data;
	}

	@Query(() => [Giphy], { description: 'Search gifs', nullable: true })
	async searchGifs(@Arg('query') query: string): Promise<Giphy[]> {
		const res = await this.get<GifResponse>('search', { q: query });
		return res.data;
	}
}
