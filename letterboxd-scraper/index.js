const express = require('express');
const axios = require('axios');
const cheerio = require('cheerio');
const cors = require('cors');
const path = require('path');

const app = express();
const port = 3000;

// Use CORS middleware
app.use(cors());
app.use(express.json());

// Add Content Security Policy middleware
app.use((req, res, next) => {
  res.setHeader("Content-Security-Policy", "default-src 'self'; font-src 'self' https://fonts.gstatic.com");
  next();
});

// Serve static files (e.g., HTML, CSS, JS)
app.use(express.static(path.join(__dirname, 'public')));

// Define a route for the root
app.get('/', (req, res) => {
    res.send('Welcome to the Letterboxd Scraper API!');
});

// Define the scrape route
app.get('/scrape/:username', async (req, res) => {
    const username = req.params.username;

    try {
        const url = `https://letterboxd.com/${username}/`;
        const { data } = await axios.get(url);
        const $ = cheerio.load(data);

        // Update selectors based on what you find
        const profileName = $('h1.profile-header__name').text().trim();

        const ratings = [];
        $('div.movie').each((i, elem) => {
            ratings.push({
                movie: $(elem).find('.movie-title').text().trim(),
                rating: $(elem).find('.rating').text().trim(),
            });
        });

        const watchlist = [];
        $('div.watchlist .movie-item').each((i, elem) => {
            watchlist.push({
                movie: $(elem).find('.movie-title').text().trim(),
                url: $(elem).find('a').attr('href'),
            });
        });

        const reviews = [];
        $('div.review').each((i, elem) => {
            reviews.push({
                movie: $(elem).find('.movie-title').text().trim(),
                review: $(elem).find('.review-content').text().trim(),
                rating: $(elem).find('.rating').text().trim(),
            });
        });

        const lists = [];
        $('div.user-lists a.list-link').each((i, elem) => {
            lists.push({
                listName: $(elem).text().trim(),
                listUrl: $(elem).attr('href'),
            });
        });

        res.json({
            profileName,
            ratings,
            watchlist,
            reviews,
            lists,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to scrape data' });
    }
});

// Start the server
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
