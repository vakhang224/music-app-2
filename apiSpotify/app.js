const express = require('express');
const qs = require('qs');
require('dotenv').config();
const cors = require('cors');
const app = express();
const client_id = process.env.CLIENT_ID;
const client_secret = process.env.CLIENT_SECRET;

app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE'], 
  allowedHeaders: ['Content-Type', 'Authorization']
}));


async function getAccessToken() {
  try {
    const body = qs.stringify({ grant_type: 'client_credentials' });

    const response = await fetch('https://accounts.spotify.com/api/token', {
      method: 'POST',
      headers: {
        'Authorization': 'Basic ' + Buffer.from(client_id + ':' + client_secret).toString('base64'),
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: body
    });

    const data = await response.json();

    if (!response.ok) {
      console.error(data);
      throw new Error('Failed to get token');
    }

    return data.access_token;
  } catch (error) {
    console.error('Error getting access token:', error);
    throw new Error('Unable to get access token');
  }
}


app.get('/spotify/search', async (req, res) => {
  const query = req.query.q;

  if (!query) {
    return res.status(400).json({ error: 'Query parameter "q" is required' });
  }

  try {
    const accessToken = await getAccessToken();

    const response = await fetch(`https://api.spotify.com/v1/search?q=${encodeURIComponent(query)}&type=track,artist,album&limit=10`, {
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    });

    const data = await response.json();

    if (!response.ok) {
      console.error(data);
      return res.status(500).json({ error: 'Error searching Spotify' });
    }

    res.json(data);
  } catch (error) {
    console.error('Error searching Spotify:', error);
    res.status(500).json({ error: 'Error searching Spotify' });
  }
});

app.get("/spotify/Track", async (req, res) => {
  try {

    const id = req.query.id

    if(!id){
      return res.status(400).json({error:"Missing ids paramater"})
    }



    const ACCESS_TOKEN = await getAccessToken();
    const response = await fetch(`https://api.spotify.com/v1/tracks/${encodeURIComponent(id)}`, {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${ACCESS_TOKEN}`, // Thêm Authorization header
        "Content-Type": "application/json"
      }
    });


    const data = await response.json();
    res.json(data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Có lỗi xảy ra' });
  }
});

app.get("/spotify/Album",async (req,res)=>{
  const id = req.query.id
  try{

    const ACCESS_TOKEN = await getAccessToken()
    const response = await fetch(`https://api.spotify.com/v1/albums/${encodeURIComponent(id)}`, {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${ACCESS_TOKEN}`, // Thêm Authorization header
        "Content-Type": "application/json"
      }
    });
    const data = await response.json()
    res.json(data)
  }catch(err){
      console.log(err)
  }


})

app.get("/spotify/Artist",async (req,res)=>{
const id = req.query.id
try{


const ACCESS_TOKEN = await getAccessToken()
const respone = await fetch(`https://api.spotify.com/v1/artists/${encodeURIComponent(id)}`,{
  method:"GET",
  headers: {
    "Authorization": `Bearer ${ACCESS_TOKEN}`, // Thêm Authorization header
    "Content-Type": "application/json"
  }
})

const data = await respone.json()
res.json(data)

}catch(err){
  console.log(err)
}
})

app.get("/spotify/Tracks", async (req, res) => {
  try {
    if (!req.query.ids) {
      return res.status(400).json({ error: "Missing ids parameter" });
    }
    let idsArray = Array.isArray(req.query.ids) ? req.query.ids : req.query.ids.split(',');

    const idString = idsArray.join(',');

    const ACCESS_TOKEN = await getAccessToken();

    const response = await fetch(`https://api.spotify.com/v1/tracks?ids=${encodeURIComponent(idString)}`, {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${ACCESS_TOKEN}`,
        "Content-Type": "application/json"
      }
    });

    if (!response.ok) {
      throw new Error('Spotify API returned an error');
    }

    const data = await response.json();
    res.json(data.tracks); // Trả về đúng mảng tracks
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Có lỗi xảy ra' });
  }
});

app.get("/spotify/Albums",async (req,res)=>{
  try {
    if (!req.query.ids) {
      return res.status(400).json({ error: "Missing ids parameter" });
    }
    let idsArray = Array.isArray(req.query.ids) ? req.query.ids : req.query.ids.split(',');

    const idString = idsArray.join(',');

    const ACCESS_TOKEN = await getAccessToken();

    const response = await fetch(`https://api.spotify.com/v1/albums?ids=${encodeURIComponent(idString)}`, {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${ACCESS_TOKEN}`,
        "Content-Type": "application/json"
      }
    });

    if (!response.ok) {
      throw new Error('Spotify API returned an error');
    }

    const data = await response.json();
    res.json(data.albums); // Trả về đúng mảng tracks
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Có lỗi xảy ra' });
  }
})

app.get("/spotify/Albums/newRelease",async (req, res) => {
  try {
    const accessToken = await getAccessToken();
    const response = await fetch(`https://api.spotify.com/v1/browse/new-releases?limit=10`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    const data = await response.json();

    if (!response.ok) {
      console.error(data);
      return res.status(500).json({ error: 'Error fetching albums from Spotify' });
    }

    // Chỉ lấy album cần thiết
    const albums = data.albums.items.map((item) => ({
      id: item.id,
      name: item.name,
      artists: item.artists.map((artist) => artist.name).join(', '),
      image: item.images[0]?.url,
    }));

    res.json({ albums });
  } catch (error) {
    console.error('Error fetching albums:', error);
    res.status(500).json({ error: 'Error fetching albums from Spotify' });
  }
})



app.listen(3000, "0.0.0.0",() => {
  console.log(`Server is running on http://localhost:3000`);
});
