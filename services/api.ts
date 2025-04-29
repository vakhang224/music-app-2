
const API_BASE_URL = "http://192.168.1.70:8888"

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

  // Ensure access token is returned correctly
  return {
    BASE_URL: 'https://api.spotify.com/v1',
    API_KEY: accessToken, // Use the obtained access token
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  };
};

export const fetchArtists = async ({ query }: { query: string }) => {
    const config = await getSpotifyConfig(); // Await to get the config with accessToken
    if (!config) {
      console.error('Failed to get Spotify config');
      return;
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

  export const fetchReleaseAlbum = async () => {
    const config = await getSpotifyConfig();
    if (!config){
      console.error("Failed to fetch config")
      return;
    }

    const {  BASE_URL, headers } = config;
    const endpoint = `${BASE_URL}/browse/new-releases`;
    console.log(`Fetch data: ${endpoint}`)
    try{
      const response = await fetch(endpoint, {
        method: 'GET',
        headers: headers,
      });
      
      if (!response.ok) {
        throw new Error(`Failed to fetch albums with status: ${response.status}`);
      }
      const data = await response.json()
      console.log("Fetch album: ", data);
      return data;
    }
    catch(e){
      console.error('Error fetching album', e)
      return null
    }
  }

  // Gọi album của artist cụ thể

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

  export async function fetchMultipleArtistsAlbums(artistIds: string[]) {
  const results = await Promise.all(
    artistIds.map(id => fetchArtistsAlbum({ query: id }))
  );
  return results;
}

  
