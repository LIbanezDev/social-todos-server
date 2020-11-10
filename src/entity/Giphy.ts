import {Field, ObjectType} from "type-graphql";

@ObjectType({description:"Data on versions of this GIF with a fixed height of 200 pixels. Good for mobile use."})
export class FixedImage {
    @Field({description: "The publicly-accessible direct URL for this GIF for this size of the GIF"})
    url!: string

    @Field({description:"The width of this GIF in pixels."})
    width!: string

    @Field({description: "The height of this GIF in pixels."})
    height!: string

    @Field({description:"size: string"})
    size!: string
}

@ObjectType({description: "The Images Object found in the GIF Object contains a series of Rendition Objects. These Rendition Objects includes the URLs and sizes for the many different renditions we offer for each GIF."})
export class Image {
    @Field({description:"Data on versions of this GIF with a fixed height of 200 pixels. Good for mobile use."})
    fixed_height!: FixedImage

    @Field({description:"Data on versions of this GIF with a fixed width of 200 pixels. Good for mobile use."})
    fixed_width!: FixedImage

}


@ObjectType({description: "GIF Objects are returned from most of GIPHY API's Endpoints. These objects contain a variety of information, such as the Image Object, which itself includes the URLS for multiple different GIFS formats and sizes."})
export class Giphy {
    @Field({description: "By default, this is almost always GIF."})
    type!: string

    @Field({description: "This GIF's unique ID"})
    id!: string

    @Field({description: "The unique URL for this GIF"})
    url!: string

    @Field({description: "The unique bit.ly URL for this GIF"})
    bitly_url!: string

    @Field({description: "A URL used for embedding this GIF"})
    embed_url!: string

    @Field({description: "The username this GIF is attached to, if applicable"})
    username!: string

    @Field({description: "The page on which this GIF was found"})
    source!: string

    @Field({description: "The MPAA-style rating for this content. Examples include Y, G, PG, PG-13 and R"})
    rating!: string

    @Field({description: "The title that appears on giphy.com for this GIF.d"})
    title!: string

    @Field({description: "The date this GIF was added to the GIPHY database."})
    create_datetime!: string

    @Field({description:"An object containing data for various available formats and sizes of this GIF."})
    images!: Image
}
