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
    images: {
        url:string,
    }[],
    artists:{
        name:string
    }[]
}

interface AlbumTracks {
  album_type: string;
  total_tracks: number;
  available_markets: string[];
  external_urls: {
    spotify: string;
  };
  href: string;
  id: string;
  images: Array<{
    url: string;
    height: number;
    width: number;
  }>;
  name: string;
  release_date: string;
  release_date_precision: string;
  restrictions: {
    reason: string;
  };
  type: string;
  uri: string;
  artists: Array<{
    external_urls: {
      spotify: string;
    };
    href: string;
    id: string;
    name: string;
    type: string;
    uri: string;
  }>;
  tracks: {
    href: string;
    limit: number;
    next: string;
    offset: number;
    previous: string;
    total: number;
    items: Array<{
      artists: Array<{
        external_urls: {
          spotify: string;
        };
        href: string;
        id: string;
        name: string;
        type: string;
        uri: string;
      }>;
      available_markets: string[];
      disc_number: number;
      duration_ms: number;
      explicit: boolean;
      external_urls: {
        spotify: string;
      };
      href: string;
      id: string;
      is_playable: boolean;
      linked_from: {
        external_urls: {
          spotify: string;
        };
        href: string;
        id: string;
        type: string;
        uri: string;
      };
      restrictions: {
        reason: string;
      };
      name: string;
      preview_url: string;
      track_number: number;
      type: string;
      uri: string;
      is_local: boolean;
    }>;
  };
  copyrights: Array<{
    text: string;
    type: string;
  }>;
  external_ids: {
    isrc: string;
    ean: string;
    upc: string;
  };
  genres: string[];
  label: string;
  popularity: number;
}
