const express = require("express");
const axios = require("axios");
const app = express();
const PORT = process.env.PORT || 3000;

let accessToken = null;
let tokenExpire = 0;

async function refreshToken() {
  const now = Date.now();
  if (accessToken && now < tokenExpire) return accessToken;
  const authString = Buffer.from(process.env.SPOTIFY_CLIENT_ID + ":" + process.env.SPOTIFY_CLIENT_SECRET).toString("base64");
  const response = await axios.post("https://accounts.spotify.com/api/token", "grant_type=client_credentials", {
    headers: { Authorization: `Basic ${authString}`, "Content-Type": "application/x-www-form-urlencoded" }
  });
  accessToken = response.data.access_token;
  tokenExpire = now + response.data.expires_in * 1000 - 60000;
  return accessToken;
}

app.get("/current-track", async (req, res) => {
  try {
    const token = await refreshToken();
    const albumId = "0kQNJeVJkWP3ViM4UokDAS"; // Kiss me in Palermo
    const response = await axios.get(`https://api.spotify.com/v1/albums/${albumId}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    res.json({
      name: response.data.name,
      cover: response.data.images[0]?.url,
      link: response.data.external_urls.spotify,
      brand: "DJ Angels" 
    });
  } catch (err) {
    res.status(500).json({ error: "Spotify API Fehler" });
  }
});

module.exports = app;
