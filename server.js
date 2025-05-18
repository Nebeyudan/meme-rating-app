// server.js
require('dotenv').config();

const express      = require('express');
const path         = require('path');
const { MongoClient } = require('mongodb');

const memesRouter   = require('./routers/memes');
const reviewsRouter = require('./routers/reviews');

const app  = express();
const PORT = process.argv[2] || 3000;

// Parse URL‐encoded form bodies
app.use(express.urlencoded({ extended: true }));
// Serve static files (CSS)
app.use(express.static(path.join(__dirname, 'public')));

async function main() {
  // Connect to MongoDB via MONGO_URI in .env
  const client = new MongoClient(process.env.MONGO_URI);
  await client.connect();
  const db          = client.db(process.env.MONGO_DB_NAME);
  const reviewsColl = db.collection('reviews');

  // Make the reviews collection available on every req
  app.use((req, _res, next) => {
    req.reviewsColl = reviewsColl;
    next();
  });

  // Mount routers
  app.use('/',      memesRouter);
  app.use('/reviews', reviewsRouter);

  app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
  });
}

main().catch(err => {
  console.error('Fatal error:', err);
  process.exit(1);
});
