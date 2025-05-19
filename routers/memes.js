const express = require('express');
const router  = express.Router();

const API_KEY = process.env.API_KEY;
router.get('/', (_req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>Meme Rating App</title>
      <link 
        href="https://fonts.googleapis.com/css2?family=Roboto&display=swap" 
        rel="stylesheet">
      <link rel="stylesheet" href="/styles.css">
      <style>
        .home-buttons {
          display: flex;
          gap: 20px;
          margin-top: 40px;
          justify-content: center;
        }
        .home-buttons a button {
          padding: 12px 24px;
          font-size: 1.2em;
          cursor: pointer;
        }
      </style>
    </head>
    <body>
      <h1 class="container">Meme Rating App</h1>
      <div class="home-buttons container">
        <a href="/memes"><button>View Memes</button></a>
        <a href="/reviews"><button>View Reviews</button></a>
      </div>
    </body>
    </html>
  `);
});
router.get('/memes', async (_req, res) => {
  try {
    const apiUrl = `https://api.apileague.com/search-memes` +
                   `?api-key=${API_KEY}` +
                   `&number=25` +
                   `&media-type=image`;
    const response = await fetch(apiUrl);
    const { memes = [] } = await response.json();

    const items = memes.map(m => `
      <a href="/meme?url=${encodeURIComponent(m.url)}" title="${m.description}">
        <img src="${m.url}" alt="meme">
      </a>
    `).join('');

    res.send(`
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>Random Meme Gallery</title>
        <link 
          href="https://fonts.googleapis.com/css2?family=Roboto&display=swap" 
          rel="stylesheet">
        <link rel="stylesheet" href="/styles.css">
      </head>
      <body>
        <div class="container">
          <h1>Random Meme Gallery</h1>
          <div class="meme-grid">
            ${items}
          </div>
          <p><a href="/"><button>Home</button></a></p>
        </div>
      </body>
      </html>
    `);
  } catch (err) {
    res.status(500).send('Error fetching memes');
  }
});
router.get('/meme', (req, res) => {
  const memeUrl = req.query.url;
  if (!memeUrl) return res.redirect('/');

  res.send(`
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>Rate Meme</title>
      <link 
        href="https://fonts.googleapis.com/css2?family=Roboto&display=swap" 
        rel="stylesheet">
      <link rel="stylesheet" href="/styles.css">
    </head>
    <body>
      <div class="container">
        <h1>Rate This Meme</h1>
        <div class="meme-container">
          <img src="${memeUrl}" alt="meme">
        </div>
        <form method="POST" action="/reviews" class="review-form">
          <input type="hidden" name="memeUrl" value="${memeUrl}">
          <label>Your review:</label>
          <textarea name="review" required></textarea>
          <button type="submit">Submit Review</button>
        </form>
        <p>
          <a href="/"><button>Home</button></a>
          <a href="/reviews"><button>See All Reviews</button></a>
        </p>
      </div>
    </body>
    </html>
  `);
});

module.exports = router;
