export default async function handler(req, res) {
  try {
    const clientId = process.env.SPOTIFY_CLIENT_ID;
    const clientSecret = process.env.SPOTIFY_CLIENT_SECRET;

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

    // Aktuelle Single
    const albumId = "0kQNJeVJkWP3ViM4UokDAS";

    const albumRes = await fetch(`https://api.spotify.com/v1/albums/${albumId}`, {
      headers: {
        "Authorization": `Bearer ${accessToken}`
      }
    });
    const album = await albumRes.json();

    res.status(200).json({
      name: album.name,
      cover: album.images[0]?.url || "https://placehold.co/600x600/111/fff?text=No+Cover",
      link: album.external_urls.spotify
    });
  } catch (err) {
    res.status(500).json({ error: "API Fehler", details: err.toString() });
  }
}
