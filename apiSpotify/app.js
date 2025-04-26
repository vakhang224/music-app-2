const express = require('express');
const qs = require('qs');
require('dotenv').config();
const cors = require('cors');
const app = express();
app.use(cors())
const client_id = process.env.CLIENT_ID;
const client_secret = process.env.CLIENT_SECRET;

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

app.get("/spotify/track", async (req, res) => {
  const id = req.query.id;

  try {
    const ACCESS_TOKEN = await getAccessToken();
    const response = await fetch(`https://api.spotify.com/v1/tracks/${id}`, {
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

app.listen(3000, () => {
  console.log(`Server is running on http://localhost:3000`);
});
