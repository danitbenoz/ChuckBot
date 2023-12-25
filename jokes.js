const axios = require('axios');
const cheerio = require('cheerio');

// Function to scrape Chuck Norris jokes
async function scrapeJokes() {
    let jokes = [];

    try {
        const response = await axios.get('https://parade.com/968666/parade/chuck-norris-jokes/', {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Safari/537.36',
                'Accept-Language': 'en-US,en;q=0.9',
            },
        });

        jokes = extractJokes(response.data);
        console.log('Jokes scraped successfully!');
    } catch (error) {
        console.error('Error scraping jokes:', error.message);
    }

    return jokes;
}

// Function to extract jokes from HTML
function extractJokes(html) {
    const $ = cheerio.load(html);
    const jokesArray = [];
    $('ol li').each((index, element) => {
        const jokeText = $(element).text().trim();
        jokesArray.push(jokeText);
    });
    console.log('Extracted Jokes:', jokesArray);
    return jokesArray;
}

module.exports = {
    scrapeJokes,
    extractJokes,
};