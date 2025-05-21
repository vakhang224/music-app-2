import { Timestamp } from "react-native-reanimated/lib/typescript/commonTypes";

export interface LibraryArtist {
  Artist_ID: string;        // ID của nghệ sĩ
  Library_ID: string;       // ID của thư viện
  Library_Artist_ID: string; // ID duy nhất của mối quan hệ
  Date_current:Date;
}

export interface Playlist {
  Playlist_ID: string;         // ID của Playlist
  Name_Playlist: string;       // Tên Playlist
  Owner_ID: string;            // ID người sở hữu Playlist
  Libary_ID?: string;     
  category:string;    // ID của Thư viện (tuỳ chọn)
}

export interface ArtistImage {
  url: string;
  height: number;
  width: number;
}

export interface ExternalUrls {
  spotify: string;
}

export interface Followers {
  href: string | null;
  total: number;
}

export interface Artist {
  external_urls: ExternalUrls;
  followers: Followers;
  genres: string[];
  href: string;
  id: string;
  images: ArtistImage[];
  name: string;
  popularity: number;
  type: 'artist';
  uri: string;
  Date_current:Date;
  category:string;
}

export interface Track {
  Track_ID:string;
  URL_Song:string;
    Date_current:Date; 
}

export interface ArtistsResponse {
  artists: Artist[];
}

export interface LIBARY{
    artist:Artist[],
    playlist:Playlist[]
}

export enum typeSort{
  default,alphaSort,dateSort
}

export enum typeNumberColumn{
  defaultColumn,TwoColumn,ThreeColumn
}
