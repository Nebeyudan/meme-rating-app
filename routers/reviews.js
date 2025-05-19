const express = require('express');
const router  = express.Router();
router.post('/', async (req, res) => {
  const { memeUrl, review } = req.body;
  await req.reviewsColl.insertOne({
    memeUrl,
    review,
    createdAt: new Date()
  });
  res.redirect('/reviews');
});
router.post('/deleteAll', async (req, res) => {
  await req.reviewsColl.deleteMany({});
  res.redirect('/reviews');
});
router.get('/', async (req, res) => {
  const all = await req.reviewsColl.find().toArray();
  const grouped = all.reduce((acc, r) => {
    (acc[r.memeUrl] = acc[r.memeUrl]||[]).push(r);
    return acc;
  }, {});

  const sections = Object.entries(grouped).map(([url, revs]) => `
    <div class="review-container">
      <img src="${url}" alt="meme">
      <ul>
        ${revs.map(r => `<li>${r.review}</li>`).join('')}
      </ul>
    </div>
  `).join('') || `<p>No reviews yet.</p>`;

  res.send(`
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>All Reviews</title>
      <link 
        href="https://fonts.googleapis.com/css2?family=Roboto&display=swap" 
        rel="stylesheet">
      <link rel="stylesheet" href="/styles.css">
    </head>
    <body>
      <div class="container">
        <h1>All Meme Reviews</h1>

        ${sections}

        <!-- Delete-all button -->
        <form method="POST" action="/reviews/deleteAll" class="erase-form">
          <button type="submit">Delete All Reviews</button>
        </form>

        <p><a href="/"><button>Home</button></a></p>
      </div>
    </body>
    </html>
  `);
});

module.exports = router;
