export default async function handler(req, res) {
  try {
    const clientId = process.env.SPOTIFY_CLIENT_ID;
    const clientSecret = process.env.SPOTIFY_CLIENT_SECRET;

    const token = await fetch("https://accounts.spotify.com/api/token", {
      method: "POST",
      headers: {
        Authorization: "Basic " + Buffer.from(clientId + ":" + clientSecret).toString("base64"),
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: "grant_type=client_credentials",
    }).then(r => r.json());

    const album = await fetch(`https://api.spotify.com/v1/albums/0kQNJeVJkWP3ViM4UokDAS`, {
      headers: { Authorization: `Bearer ${token.access_token}` },
    }).then(r => r.json());

    res.status(200).json({
      name: album.name,
      cover: album.images?.[0]?.url,
      link: album.external_urls.spotify,
    });
  } catch (e) {
    res.status(500).json({ error: "Spotify API Fehler", details: e.toString() });
  }
}
