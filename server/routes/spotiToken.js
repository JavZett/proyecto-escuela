const express = require('express');
const request = require('request');

const app = express();

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept'
  );
  next();
});

app.get('/token/:client_id/:client_secret', (req, res) => {
  const client_id = req.params.client_id;
  const client_secret = req.params.client_secret;
  const spotiURL = 'https://accounts.spotify.com/api/token';

  const authOptions = {
    url: spotiURL,
    headers: {
      Authorization:
        'Basic ' +
        new Buffer.from(client_id + ':' + client_secret).toString('base64'),
    },
    form: {
      grant_type: 'client_credentials',
    },
    json: true,
  };

  request.post(authOptions, (err, httpResponse, body) => {
    if (err) {
      return res.status(400).json({
        ok: false,
        message: 'No se pudo obtener el token',
        error: err,
      });
    }
    res.json({
      ok: true,
      body,
    });
  });
});

module.exports = app;
