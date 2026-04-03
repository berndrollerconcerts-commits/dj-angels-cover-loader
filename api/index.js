const axios = require("axios");

module.exports = async (req, res) => {
  try {
    const authString = Buffer.from(process.env.SPOTIFY_CLIENT_ID + ":" + process.env.SPOTIFY_CLIENT_SECRET).toString("base64");
    
    // 1. Token holen
    const tokenResponse = await axios.post("https://accounts.spotify.com/api/token", "grant_type=client_credentials", {
      headers: { 
        Authorization: `Basic ${authString}`, 
        "Content-Type": "application/x-www-form-urlencoded" 
      }
    });
    
    const token = tokenResponse.data.access_token;
    const albumId = "0kQNJeVJkWP3ViM4UokDAS"; 

    // 2. Daten von Spotify abrufen
    const response = await axios.get(`https://api.spotify.com/v1/albums/${albumId}`, {
      headers: { Authorization: `Bearer ${token}` }
    });

    // 3. Antwort an deine Website senden
    res.status(200).json({
      name: response.data.name,
      cover: response.data.images[0]?.url,
      link: response.data.external_urls.spotify
    });
  } catch (err) {
    res.status(500).json({ error: "Spotify Fehler", details: err.message });
  }
};
