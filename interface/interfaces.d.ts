export interface ExternalUrl {
  spotify: string;
}

export interface Image {
  url: string;
  height: number;
  width: number;
}

export interface Artist {
  id: string;
  name: string;
  type: string;
  uri: string;
  href: string;
  external_urls: ExternalUrl;
  images?: Image[]; // optional - chỉ dùng khi fetch nghệ sĩ riêng
}

interface Album {
  id: string;
  name: string;
  type: string;
  uri: string;
  href: string;
  album_type: string;
  artists: Artist[];
  images: Image[];
  release_date: string;
  release_date_precision: string;
  external_urls: ExternalUrl;
  available_markets: string[];
  total_tracks: number;
  restrictions?: { reason: string };
}

interface Track {
  id: string;
  name: string;
  type: string;
  uri: string;
  href: string;
  duration_ms: number;
  explicit: boolean;
  is_playable: boolean;
  is_local: boolean;
  track_number: number;
  disc_number: number;
  preview_url: string;
  popularity: number;
  album: Album;
  artists: Artist[];
  external_urls: ExternalUrl;
  external_ids: {
    isrc: string;
    ean: string;
    upc: string;
  };
  available_markets: string[];
  linked_from?: object;
  restrictions?: { reason: string };
}

export interface AlbumTracks {
  id: string;
  name: string;
  type: string;
  uri: string;
  href: string;
  album_type: string;
  artists: Artist[];
  images: Image[];
  release_date: string;
  release_date_precision: string;
  available_markets: string[];
  external_urls: ExternalUrl;
  label: string;
  popularity: number;
  total_tracks: number;
  tracks: {
    href: string;
    total: number;
    limit: number;
    offset: number;
    next: string;
    previous: string;
    items: Track[];
  };
  external_ids: {
    isrc: string;
    ean: string;
    upc: string;
  };
  copyrights: {
    text: string;
    type: string;
  }[];
  genres: string[];
  restrictions?: { reason: string };
}

export interface PlaylistOwner {
  id: string;
  display_name: string;
  href: string;
  type: string;
  uri: string;
  external_urls: ExternalUrl;
}

export interface Playlist {
  id: string;
  name: string;
  type: string;
  uri: string;
  href: string;
  public: boolean;
  collaborative: boolean;
  description: string;
  snapshot_id: string;
  external_urls: ExternalUrl;
  images: Image[];
  owner: PlaylistOwner;
  tracks: {
    href: string;
    total: number;
  };
}
