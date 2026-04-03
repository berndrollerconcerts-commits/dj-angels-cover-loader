export default async function (req, res) {
  const clientId = process.env.SPOTIFY_CLIENT_ID;
  const clientSecret = process.env.SPOTIFY_CLIENT_SECRET;
  const albumId = "0kQNJeVJkWP3ViM4UokDAS";

  try {
    const auth = Buffer.from(`${clientId}:${clientSecret}`).toString("base64");
    
    // 1. Token holen
    const tokenRes = await fetch("https://accounts.spotify.com/api/token", {
      method: "POST",
      headers: {
        Authorization: `Basic ${auth}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: "grant_type=client_credentials",
    });
    const { access_token } = await tokenRes.json();

    // 2. Album Daten holen
    const albumRes = await fetch(`https://api.spotify.com/v1/albums/${albumId}`, {
      headers: { Authorization: `Bearer ${access_token}` },
    });
    const data = await albumRes.json();

    res.status(200).json({
      name: data.name,
      cover: data.images[0]?.url,
      link: data.external_urls.spotify
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
