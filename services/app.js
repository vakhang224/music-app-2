var express = require('express');
var request = require('request');
var querystring = require('querystring');
var cors = require('cors');

var client_id = 'bd8df4c718f04da99e7cb2cc4db8f245';
var client_secret = 'c37c9eab59834f5ba2e1015d278c4364';
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
  var scope = 'user-read-private user-read-email user-read-playback-state user-modify-playback-state user-read-currently-playing user-read-recently-played';

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

function refreshAccessToken() {
  if (!refresh_token) {
    console.log("No refresh token available.");
    return;
  }

  var authOptions = {
    url: 'https://accounts.spotify.com/api/token',
    headers: {
      'Authorization': 'Basic ' + Buffer.from(client_id + ':' + client_secret).toString('base64'),
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