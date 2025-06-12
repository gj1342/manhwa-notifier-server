const axios = require('axios');
const cheerio = require('cheerio');

exports.scrapeManga = async (url, config) => {
  const { data: html } = await axios.get(url);
  const $ = cheerio.load(html);
  // TODO: implement scraping using config
  return {};
}; 