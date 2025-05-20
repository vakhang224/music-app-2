var express = require('express');
var request = require('request');
var querystring = require('querystring');
var cors = require('cors');

var client_id = '0a821d9156594cf1a836be5326ce7fb7';
var client_secret = '72bd2a8f33e54486b27c977f236c2226';
var redirect_uri = 'http://127.0.0.1:8888/callback';

var app = express();

app.use(cors({
  origin: '*',
  methods: ['GET', 'POST'],
  credentials: true
}));

var access_token = null;
var refresh_token = null;
var access_token_expiry_time = null;


function generateRandomString(length) {
  var text = '';
  var possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  for (var i = 0; i < length; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return text;
}

app.get('/login', function (req, res) {
  var state = generateRandomString(16);
  var scope ='user-read-private user-read-email user-read-playback-state user-modify-playback-state user-read-currently-playing user-read-recently-played user-top-read';

  res.redirect('https://accounts.spotify.com/authorize?' +
    querystring.stringify({
      response_type: 'code',
      client_id: client_id,
      scope: scope,
      redirect_uri: redirect_uri,
      state: state
    }));
});

app.get('/callback', function (req, res) {
  var code = req.query.code || null;
  var state = req.query.state || null;

  if (state === null) {
    res.send({ error: 'state_mismatch' });
    return;
  }

  var authOptions = {
    url: 'https://accounts.spotify.com/api/token',
    form: {
      code: code,
      redirect_uri: redirect_uri,
      grant_type: 'authorization_code'
    },
    headers: {
      'Authorization': 'Basic ' + Buffer.from(client_id + ':' + client_secret).toString('base64'),
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    json: true
  };

  request.post(authOptions, function (error, response, body) {
    if (error) {
      console.error('Error during token request:', error);
      res.send({ error: 'Request error' });
    } else {
      console.log('Spotify token response:', body);
      if (response.statusCode === 200) {
        access_token = body.access_token;
        refresh_token = body.refresh_token;
        access_token_expiry_time = Date.now() + (3600 * 1000);

        res.send({
          access_token: access_token,
          refresh_token: refresh_token
        });

        setInterval(refreshAccessTokenIfNeeded, 3600 * 1000);
      } else {
        res.send({ error: 'invalid_token' });
      }
    }
  });
});

function isAccessTokenExpired() {
  return Date.now() > access_token_expiry_time;
}

function refreshAccessTokenIfNeeded() {
  if (isAccessTokenExpired()) {
    refreshAccessToken();
  }
}

app.get('/api/top-artists', function(req, res) {
  if (!access_token) {
    return res.status(401).json({ error: 'No access token' });
  }

  var options = {
    url: 'https://api.spotify.com/v1/me/top/artists?limit=30&time_range=medium_term',
    headers: {
      'Authorization': 'Bearer ' + access_token
    },
    json: true
  };

  request.get(options, function(error, response, body) {
    if (error) {
      return res.status(500).json({ error: 'Spotify API request error' });
    }
    if (response.statusCode !== 200) {
      return res.status(response.statusCode).json({ error: body });
    }

    res.json(body);
  });
});

function refreshAccessToken() {
  if (!refresh_token) {
    console.log("No refresh token available.");
    return;
  }

  var authOptions = {
    url: 'https://accounts.spotify.com/api/token',
    headers: {'Authorization': 'Basic ' + Buffer.from(client_id + ':' + client_secret).toString('base64'),
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    form: {
      grant_type: 'refresh_token',
      refresh_token: refresh_token
    },
    json: true
  };

  request.post(authOptions, function (error, response, body) {
    if (error) {
      console.error('Error refreshing token:', error);
    } else {
      if (response.statusCode === 200) {
        access_token = body.access_token;
        refresh_token = body.refresh_token || refresh_token;
        access_token_expiry_time = Date.now() + (3600 * 1000);
        console.log('Access token refreshed');
      } else {
        console.log('Error refreshing token:', response.statusCode, body);
      }
    }
  });
}

app.get('/api/token', function (req, res) {
  if (access_token) {
    res.json({ accessToken: access_token });
  } else {
    res.status(404).json({ error: 'Access token not available' });
  }
});

app.listen(8888, '0.0.0.0', function () {
  console.log('Server listening on all interfaces at port 8888');
  console.log('- Local access: http://localhost:8888/login');
  console.log('- For testing on other devices, use your network IP with port 8888');
});