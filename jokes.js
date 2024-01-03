const axios = require('axios');
const cheerio = require('cheerio');

// Function to scrape Chuck Norris jokes
async function scrapeJokes() {
    // Initialize an empty array to store the scraped jokes
    let jokes = [];

    try {
        const response = await axios.get('https://parade.com/968666/parade/chuck-norris-jokes/', {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Safari/537.36',
                'Accept-Language': 'en-US,en;q=0.9',
                'Accept-Encoding': 'gzip, compress, deflate, br',
                'Referer': 'http://parade.com',  // Add a referer header
            },
        });

    
        jokes = extractJokes(response.data);
        console.log('Jokes scraped successfully!');
    } catch (error) {
        console.error('Error scraping jokes:', error);
    
        // Log additional details for debugging
        if (error.response) {
            console.error('Response status:', error.response.status);
            console.error('Response headers:', error.response.headers);
            console.error('Response data:', error.response.data);
        } else if (error.request) {
            console.error('No response received. Request details:', error.request);
        } else {
            console.error('Other error details:', error.message);
        }
    }
    
    

    return jokes;
}

// Function to extract jokes from HTML
function extractJokes(html) {
    // Load the HTML content into a Cheerio instance
    const $ = cheerio.load(html);
    
    // Initialize an array to store the extracted jokes
    const jokesArray = [];

    $('ol li').each((index, element) => {
        // Extract and trim the text of each list item (joke)
        const jokeText = $(element).text().trim();
        // Add the trimmed joke text to the array
        jokesArray.push(jokeText);
    });
    return jokesArray;
}

module.exports = {
    scrapeJokes,
    extractJokes,
};
