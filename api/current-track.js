export default async function handler(req, res) {
  try {
    const clientId = process.env.SPOTIFY_CLIENT_ID;
    const clientSecret = process.env.SPOTIFY_CLIENT_SECRET;

    if (!clientId || !clientSecret) {
      return res.status(500).json({ error: "Spotify Credentials fehlen!" });
    }

    // Token holen
    const tokenRes = await fetch("https://accounts.spotify.com/api/token", {
      method: "POST",
      headers: {
        "Authorization": "Basic " + Buffer.from(clientId + ":" + clientSecret).toString("base64"),
        "Content-Type": "application/x-www-form-urlencoded"
      },
      body: "grant_type=client_credentials"
    });
    const tokenData = await tokenRes.json();
    const accessToken = tokenData.access_token;

    // Aktuelle Single (Spotify Album ID)
    const albumId = "0kQNJeVJkWP3ViM4UokDAS";

    const albumRes = await fetch(`https://api.spotify.com/v1/albums/${albumId}`, {
      headers: { "Authorization": `Bearer ${accessToken}` }
    });
    const album = await albumRes.json();

    res.status(200).json({
      albumId: album.id,
      name: album.name,
      cover: album.images[0]?.url,
      link: album.external_urls.spotify
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Spotify API Fehler", details: err.toString() });
  }
}
