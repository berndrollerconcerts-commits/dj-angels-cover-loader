const express = require("express");
const axios = require("axios");

const app = express();
const PORT = process.env.PORT || 3000;

let accessToken = null;
let tokenExpire = 0;

async function refreshToken() {
  const now = Date.now();
  if (accessToken && now < tokenExpire) return accessToken;

  const authString = Buffer.from(
    process.env.SPOTIFY_CLIENT_ID + ":" + process.env.SPOTIFY_CLIENT_SECRET
  ).toString("base64");

  // KORREKTUR: Echte Spotify Token URL
  const response = await axios.post(
    "https://accounts.spotify.com/api/token",
    "grant_type=client_credentials",
    {
      headers: {
        Authorization: `Basic ${authString}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
    }
  );

  accessToken = response.data.access_token;
  tokenExpire = now + response.data.expires_in * 1000 - 60000;
  return accessToken;
}

app.get("/current-track", async (req, res) => {
  try {
    const token = await refreshToken();
    const albumId = "0kQNJeVJkWP3ViM4UokDAS";

    // KORREKTUR: Echte Spotify API URL mit Backticks für die Variable
    const response = await axios.get(
      `https://api.spotify.com/v1/albums/${albumId}`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    const album = response.data;

    res.json({
      name: album.name,
      cover: album.images[0]?.url,
      link: album.external_urls.spotify,
      brand: "DJ Angels" 
    });
  } catch (err) {
    console.error("Spotify API Fehler:", err.response?.data || err.message);
    res.status(500).json({ error: "Spotify API Fehler" });
  }
});

// WICHTIG für Vercel: Export der App
module.exports = app;

app.listen(PORT, () => console.log("Server läuft auf Port " + PORT));
