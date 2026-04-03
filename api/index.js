<!DOCTYPE html>
<html lang="de">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>DJ Angels Cover Loader</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <style>
    body { margin: 0; font-family: sans-serif; color: white; background: #000000; min-height: 100vh; display: flex; flex-direction: column; align-items: center; }
    .glass { background: rgba(255, 255, 255, 0.05); backdrop-filter: blur(15px); border: 1px solid rgba(255, 255, 255, 0.1); }
    .neon-text { text-shadow: 0 0 15px rgba(255, 255, 255, 0.4); }
    .bg-logo { position: fixed; inset: 0; background-image: url('dj-angels-bg.png'); background-position: center; background-repeat: no-repeat; background-size: 70%; opacity: 0.15; z-index: -1; }
  </style>
</head>
<body class="p-6">
  <div class="bg-logo"></div>

  <div class="max-w-md w-full flex flex-col">
    <header class="w-full flex justify-between items-center mb-10">
      <span class="text-xl opacity-50">☰</span>
      <h1 class="tracking-[0.5em] font-light text-[10px] uppercase">DJ ANGELS</h1>
      <span class="text-xl opacity-50">👤</span>
    </header>

    <main class="text-center">
      <div class="relative w-full aspect-square rounded-[2.5rem] overflow-hidden mb-8 border border-white/10 shadow-2xl bg-zinc-900">
        <img id="currentCover" src="" class="w-full h-full object-cover" onerror="this.src='https://placehold.co/600x600/111/fff?text=Loading...'">
        <button id="mainVoteBtn" onclick="handleVote()" class="absolute bottom-6 right-6 p-4 glass rounded-full hover:scale-110 transition-all z-20">
          <span id="heartIcon" class="text-xl">❤️</span>
        </button>
      </div>

      <h2 id="currentTitle" class="text-4xl font-bold neon-text mb-1 uppercase tracking-tight">Loading...</h2>
      <p class="text-[9px] tracking-[0.3em] text-cyan-400 font-bold mb-10 uppercase">Available on all platforms</p>

      <div class="glass w-full py-6 rounded-[2rem] mb-10">
        <div class="flex justify-around mb-4">
          <div class="text-center"><span class="text-2xl font-bold">03</span><p class="text-[7px] opacity-40 uppercase tracking-widest">Days</p></div>
          <div class="text-center"><span class="text-2xl font-bold">12</span><p class="text-[7px] opacity-40 uppercase tracking-widest">Hours</p></div>
          <div class="text-center"><span class="text-2xl font-bold">45</span><p class="text-[7px] opacity-40 uppercase tracking-widest">Mins</p></div>
        </div>
        <div class="text-white/60 font-medium tracking-widest text-[11px] uppercase">Votes: <span id="voteCount" class="text-cyan-400">1.249</span></div>
      </div>

      <div class="flex gap-8 justify-center items-center mb-10">
        <a id="spotifyLink" href="#" target="_blank">
          <svg class="w-10 h-10 hover:scale-110 transition-transform" viewBox="0 0 168 168"><circle cx="84" cy="84" r="84" fill="#1DB954"/><path d="M119 114c-1.5 2.5-4.5 3.2-7 1.7-19-11.5-43-14-71-7-3 0.8-6-1-6.8-4-0.8-3 1-6 4-6.8 31-8 58-5 80 8 2.5 1.5 3.2 4.5 1.7 7z" fill="white"/><path d="M124 94c-2 3-6 4-9 2-22-13-55-17-81-8-3 1-7-1-8-5s1-7 5-8c30-9 67-5 93 10 3 2 4 6 2 9z" fill="white"/><path d="M126 72c-26-15-69-16-94-8-4 1-8-1-9-5-1-4 1-8 5-9 29-9 77-8 107 10 4 2 5 7 3 11-2 4-7 5-11 1z" fill="white"/></svg>
        </a>
        <a id="appleLink" href="https://music.apple.com" target="_blank">
          <svg class="w-10 h-10 hover:scale-110 transition-transform" viewBox="0 0 100 100"><circle cx="50" cy="50" r="50" fill="#FA243C"/><path d="M65 30v28a8 8 0 1 1-3-6V38l-20 6v20a8 8 0 1 1-3-6V32l26-8z" fill="white"/></svg>
        </a>
        <a id="amazonLink" href="https://music.amazon.com" target="_blank">
          <div class="w-10 h-10 rounded-full bg-[#00A8E1] flex items-center justify-center overflow-hidden hover:scale-110 transition-transform"><img src="https://upload.wikimedia.org/wikipedia/commons/a/a9/Amazon_logo.svg" class="w-6 pt-1"></div>
        </a>
      </div>

      <div class="w-full rounded-[2rem] overflow-hidden mb-12 shadow-lg border border-white/5 bg-zinc-900">
        <iframe id="topEP" style="border-radius:12px" src="" width="100%" height="352" frameBorder="0" allowfullscreen="" allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" loading="lazy"></iframe>
      </div>
    </main>
  </div>

  <script>
    let votes = 1249;
    let hasVoted = false;

    function handleVote() {
      if (!hasVoted) {
        votes++;
        document.getElementById("voteCount").innerText = votes.toLocaleString("de-DE");
        document.getElementById("heartIcon").innerText = "❤️";
        hasVoted = true;
      }
    }

    async function loadApp() {
      try {
        // Zieht die Daten von deinem Vercel-Backend Pfad
        const res = await fetch('/current-track');
        const data = await res.json();

        if (data.error) throw new Error(data.error);

        // Update UI
        document.getElementById("currentCover").src = data.cover;
        document.getElementById("currentTitle").innerText = data.name;
        document.getElementById("spotifyLink").href = data.link;

        // Erstellt den Embed-Player Link aus der Album-URL
        const albumId = data.link.split('/').pop().split('?')[0];
        document.getElementById("topEP").src = `https://open.spotify.com/embed/album/${albumId}?utm_source=generator&theme=0`;

      } catch (err) {
        console.error("Fehler beim Laden:", err);
        document.getElementById("currentTitle").innerText = "OFFLINE";
      }
    }

    window.onload = loadApp;
  </script>
</body>
</html>
