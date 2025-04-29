interface Artists {
    id: string,
    images: { url: string; height: number; width: number }[];
    name: string,
    type: string
}

interface Album{
    id: string,
    images:{
        url:string,
        width:number,
        height:number
        }[],
    name: string,
    type: string,
    artists:{
        name: string
    }[]
    };
    

interface ArtistsAlbum{
    id: string,
    name: string,
    type: string,
    images: {
        url:string,
    }[],
    owner:{
        display_name:string
    }[]
}
