import { LibraryArtist } from "@/interface/databaseModel";
import { AlbumTracks, Track } from "@/interface/interfaces";



const API_BASE_URL = "http://192.168.1.7:8888"

// Rest of your code remains the same
interface TokenResponse {
  accessToken?: string;
  error?: string;
}


export const getAccessToken = async (): Promise<string | null> => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/token`);
    if (!response.ok) {
      console.error(`Failed to get access token: ${response.statusText}`);
      return null;
    }
    
    const data: TokenResponse = await response.json();
    if (data.accessToken) {
      return data.accessToken;
    } else {
      console.error('Failed to get access token:', data.error || 'Unknown error');
      return null;
    }
  } catch (error) {
    console.error('Error fetching access token:', error);
    return null;
  }
};

export const getSpotifyConfig = async () => {
  const accessToken = await getAccessToken(); // Call to get the access token

  if (!accessToken) {
    console.error('Failed to get access token for Spotify config.');
    return null;
  }
  return {
    BASE_URL: 'https://api.spotify.com/v1',
    API_KEY: accessToken, 
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  };
};

export const fetchMultipleArtists = async (artists:LibraryArtist[]) => {
  const artistIds = artists.map((item)=>item.Artist_ID)
  const Date_currents = artists.map((item)=>item.Date_current)
  const config = await getSpotifyConfig();
  if (!config) {
    console.error("Failed to get Spotify config");
    return null;
  }

  const { BASE_URL, headers } = config;
  const idsParam = artistIds.join(',');
  const endpoint = `${BASE_URL}/artists?ids=${encodeURIComponent(idsParam)}`;

  try {
    const response = await fetch(endpoint, {
      method: 'GET',
      headers,
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch multiple artists: ${response.status}`);
    }

    const data = await response.json();
    return data.artists.map((item: any, index: number) => ({ ...item, Date_current: Date_currents[index] })); 
  } catch (error) {
    console.error("Error fetching multiple artists:", error);
    return null;
  }
};


export const fetchUserTopArtists = async () => {
  const config = await getSpotifyConfig();
  if (!config) {
    throw new Error('Failed to get Spotify config');
  }
  console.log(config)
  const { BASE_URL, headers } = config;
  const endpoint = `${BASE_URL}/me/top/artists?limit=50&offset=50`;

  try {
    const response = await fetch(endpoint, {
      method: 'GET',
      headers,
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch user top artists: ${response.status}`);
    }

    const data = await response.json();
    console.log('User top artists:', data);
    return data.items; // Trả về mảng artist luôn
  } catch (error) {
    console.error('Error fetching user top artists:', error);
    return null;
  }
};

  export const fetchReleaseAlbum = async () => {
    const config = await getSpotifyConfig();
    if (!config){
      console.error("Failed to fetch config")
      return;
    }

    const {  BASE_URL, headers } = config;
    const endpoint = `${BASE_URL}/browse/new-releases`;
    try{
      const response = await fetch(endpoint, {
        method: 'GET',
        headers: headers,
      });
      
      if (!response.ok) {
        throw new Error(`Failed to fetch albums with status: ${response.status}`);
      }
      const data = await response.json()
      return data;
    }
    catch(e){
      console.error('Error fetching album', e)
      return null
    }
  }

  export async function searchArtists(query: string, limit = 50, offset = 0) {
  const config = await getSpotifyConfig();
  if (!config) throw new Error('Không lấy được config Spotify');

  const endpoint = `${config.BASE_URL}/search?q=${encodeURIComponent(query)}&type=artist&limit=${limit}&offset=${offset}`;
  const response = await fetch(endpoint, {
    headers: config.headers,
  });

  if (!response.ok) {
    throw new Error(`Lấy artist thất bại: ${response.status}`);
  }

  const data = await response.json();
  return data.artists; // Trả về object artists chứa danh sách items, tổng số kết quả, v.v.
}

export async function searchTracks(query: string, limit = 50, offset = 0) {
  const config = await getSpotifyConfig();
  if (!config) throw new Error('Không lấy được config Spotify');

  const endpoint = `${config.BASE_URL}/search?q=${encodeURIComponent(query)}&type=track&limit=${limit}&offset=${offset}`;
  
  const response = await fetch(endpoint, {
    headers: config.headers,
  });

  if (!response.ok) {
    throw new Error(`Lấy tracks thất bại: ${response.status}`);
  }

  const data = await response.json();
  return data.tracks.items; // Trả về object tracks chứa danh sách items, total, v.v.
}




export async function fetchMultipleArtistsAlbums(artistIds: string[]) {
  const results = await Promise.all(
    artistIds.map(id => fetchArtistsAlbum({ query: id }))
  );
  return results;
}

export const fetchArtists = async ({ query }: { query: string }) => {
    const config = await getSpotifyConfig(); // Await to get the config with accessToken
    if (!config) {
      throw new Error('Failed to get Spotify config');
    }
  
    const { BASE_URL, headers } = config;
  
    // Construct the full endpoint URL (adjust endpoint as needed)
    const endpoint = `${BASE_URL}/artists?ids=${encodeURIComponent(query)}`;
    console.log(`Fetching data from endpoint: ${endpoint}`); // Log the endpoint to make sure it's correct
    try {
      const response = await fetch(endpoint, {
        method: 'GET',
        headers: headers, // Use the headers from the config
      });
  
      if (!response.ok) {
        throw new Error(`Failed to fetch artists with status: ${response.status}`);
      }
  
      const data = await response.json();
      console.log('Fetched artist data:', data); // Log the fetched data for debugging
      return data; // Return the artist data or handle it as necessary
    } catch (error) {
      console.error('Error fetching artist:', error);
      return null;
    }
    
  };

  export const fetchArtistsAlbum = async ({ query }: {query: string}) => {
    const config = await getSpotifyConfig();
    if (!config){
      console.error("Failed to fetch config")
      return;
    }

    const {  BASE_URL, headers } = config;
    const endpoint = `${BASE_URL}/artists/${encodeURIComponent(query)}/albums`;
    console.log(`Fetch data: ${endpoint}`)
    try{
      const response = await fetch(endpoint, {
        method: 'GET',
        headers: headers,
      });
      
      if (!response.ok) {
        throw new Error(`Failed to fetch a-album with status: ${response.status}`);
      }
      const data = await response.json()
      console.log("Fetch a-album: ", data);
      return data;
    }
    catch(e){
      console.error('Error fetching a-album', e)
      return null
    }
  }


export const fetchAlbums = async (id: string): Promise<AlbumTracks> => {
  const config = await getSpotifyConfig();
  if (!config) {
    throw new Error('Failed to get Spotify config');
  }

  const {  BASE_URL, headers } = config;
  try{
    const response = await fetch(`${BASE_URL}/albums/${id}`,{
      method: 'GET',
      headers: headers,
    });

    if(!response.ok){
      throw new Error('Failt to fetch album tracks')
    }

    const data = await response.json();

    return data;
  } catch(e){
    console.log(e);
    throw e;
  }
}

export const Search = async ({ query }: {query: string}) => {
  const config = await getSpotifyConfig();
  if (!config){
    console.error("Failed to fetch config")
    return;
  }

  const {  BASE_URL, headers } = config;
  const endpoint = `${BASE_URL}/search?q=${encodeURIComponent(query)}&type=album%2Cartist%2Ctrack%2Cplaylist`;
  console.log(`Fetch data: ${endpoint}`)
  try{
    const response = await fetch(endpoint, {
      method: 'GET',
      headers: headers,
    });
    
    if (!response.ok) {
      throw new Error(`Search failed: ${response.status}`);
    }
    const data = await response.json()
    console.log("Search: ", data);
    return data;
  }
  catch(e){
    console.error('Error searching', e)
    return null
  }
}
  

export const fetchPlaylists = async ({ query }: {query: string}) => {
  const config = await getSpotifyConfig();
  if (!config){
    console.error("Failed to fetch config")
    return;
  }

  const {  BASE_URL, headers } = config;
  const endpoint = `${BASE_URL}/playlists/${encodeURIComponent(query)}`;
  console.log(`Fetch data: ${endpoint}`)
  try{
    const response = await fetch(endpoint, {
      method: 'GET',
      headers: headers,
    });
    
    if (!response.ok) {
      throw new Error(`Fetch playlists failed: ${response.status}`);
    }
    const data = await response.json()
    return data;
  }
  catch(e){
    console.error('Error fetching playlists', e)
    return null
  }
}

export const fetchTopTracks = async ({ query }: {query: string}) => {
  const config = await getSpotifyConfig();
  if (!config){
    console.error("Failed to fetch config")
    return;
  }

  const {  BASE_URL, headers } = config;
  const endpoint = `${BASE_URL}/artists/${encodeURIComponent(query)}/top-tracks`;
  console.log(`Fetch data: ${endpoint}`)
  try{
    const response = await fetch(endpoint, {
      method: 'GET',
      headers: headers,
    });
    
    if (!response.ok) {
      throw new Error(`Fetch top track failed: ${response.status}`);
    }
    const data = await response.json()
    return data;
  }
  catch(e){
    console.error('Error fetching top track', e)
    return null
  }
}


export const fetchTracks = async ({ query }: { query: string }) => {
  const config = await getSpotifyConfig();
  if (!config) {
    console.error("Failed to fetch config");
    return;
  }

  console.log(query)

  const { BASE_URL, headers } = config;
  // `query` ở đây nên là chuỗi id phân tách bằng dấu phẩy: "3n3Ppam7vgaVa1iaRUc9Lp,4iV5W9uYEdYUVa79Axb7Rh"
  const endpoint = `${BASE_URL}/tracks?ids=${encodeURIComponent(query)}`;

  console.log(`Fetch data: ${endpoint}`);
  try {
    const response = await fetch(endpoint, {
      method: 'GET',
      headers,
    });

    if (!response.ok) {
      throw new Error(`Fetch track failed: ${response.status}`);
    }

    const data = await response.json();
    return data; // { tracks: [...] }
  } catch (e) {
    console.error('Error fetching track', e);
    return null;
  }
};

export const fetchAlbumTracks = async ({ query }: { query: string }) => {
    const config = await getSpotifyConfig(); // Await to get the config with accessToken
    if (!config) {
      throw new Error('Failed to get Spotify config');
    }
  
    const { BASE_URL, headers } = config;
  
    // Construct the full endpoint URL (adjust endpoint as needed)
    const endpoint = `${BASE_URL}/albums/${encodeURIComponent(query)}/tracks`;
    console.log(`Fetching data from endpoint: ${endpoint}`); // Log the endpoint to make sure it's correct
    try {
      const response = await fetch(endpoint, {
        method: 'GET',
        headers: headers, // Use the headers from the config
      });
  
      if (!response.ok) {
        throw new Error(`Failed to fetch artists with status: ${response.status}`);
      }
  
      const data = await response.json();

      return data; // Return the artist data or handle it as necessary
    } catch (error) {
      console.error('Error fetching artist:', error);
      return null;
    }
    
  };

