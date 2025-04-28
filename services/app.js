var express = require('express');
var request = require('request');
var querystring = require('querystring');
var cors = require('cors');  // Add this line

var client_id = 'b42cc2747e39432084ae1aee8268d3e9'; // Your client id
var client_secret = '65236f599c06485185deb28fe3c58c2c'; // Your secret
var redirect_uri = 'http://127.0.0.1:8888/callback'; // Your redirect uri

var app = express();

// Enable CORS for all routes
app.use(cors());  // Add this line

// Variables to store the tokens
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
  var scope = 'user-read-private user-read-email';

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

        // Calculate expiration time of access token (1 hour)
        access_token_expiry_time = Date.now() + (3600 * 1000); // 1 hour from now

        // Send tokens back as JSON
        res.send({
          access_token: access_token,
          refresh_token: refresh_token
        });

        // Automatically refresh access token every hour
        setInterval(refreshAccessTokenIfNeeded, 3600 * 1000); // Check and refresh every hour
      } else {
        res.send({ error: 'invalid_token' });
      }
    }
  });
});

// Check if the access token has expired
function isAccessTokenExpired() {
  return Date.now() > access_token_expiry_time;
}

// Refresh the access token if needed
function refreshAccessTokenIfNeeded() {
  if (isAccessTokenExpired()) {
    refreshAccessToken();
  }
}

// Refresh the access token using the refresh token
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
        refresh_token = body.refresh_token || refresh_token; // Update refresh token if new one is provided
        access_token_expiry_time = Date.now() + (3600 * 1000); // Update expiration time
        console.log('Access token refreshed');
      } else {
        console.log('Error refreshing token:', response.statusCode, body);
      }
    }
  });
}

// Endpoint to fetch the current access token
app.get('/api/token', function (req, res) {
  if (access_token) {
    res.json({ accessToken: access_token });
  } else {
    res.status(404).json({ error: 'Access token not available' });
  }
});

// Start the server
app.listen(8888, function () {
  console.log('Server listening at http://localhost:8888/login');
});
