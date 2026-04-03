const axios = require("axios");

module.exports = async (req, res) => {
  try {
    const authString = Buffer.from(process.env.SPOTIFY_CLIENT_ID + ":" + process.env.SPOTIFY_CLIENT_SECRET).toString("base64");
    const tokenRes = await axios.post("https://accounts.spotify.com/api/token", "grant_type=client_credentials", {
      headers: { Authorization: `Basic ${authString}`, "Content-Type": "application/x-www-form-urlencoded" }
    });
    
    const token = tokenRes.data.access_token;
    const albumId = "0kQNJeVJkWP3ViM4UokDAS"; // Kiss me in Palermo

    const response = await axios.get(`https://api.spotify.com/v1/albums/${albumId}`, {
      headers: { Authorization: `Bearer ${token}` }
    });

    res.status(200).json({
      name: response.data.name,
      cover: response.data.images[0]?.url,
      link: response.data.external_urls.spotify
    });
  } catch (err) {
    res.status(500).json({ error: "Spotify Fehler", details: err.message });
  }
};
