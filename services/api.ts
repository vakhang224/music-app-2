export const SPOTIFY_CONFIG = {
    BASE_URL: 'https://api.spotify.com/v1/',
    API_KEY: process.env.CLIENT_ID,
    headers: {
        Authorization:  `Bearer ${process.env.CLIENT_ID}`
    }
}
export const fetchMusics = async() => {
    const endpoint = `${SPOTIFY_CONFIG.BASE_URL}/`

    if (!response.ok){
        // @ts-ignore
        throw new Error("Failed to fetch songs!!", response.statusText);
        
    }

    const data = await response.json();

    return data.results;
}