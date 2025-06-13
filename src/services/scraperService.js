import axios from 'axios';
import cheerio from 'cheerio';

export const scrapeManga = async (url, config) => {
  const { data: html } = await axios.get(url);
  const $ = cheerio.load(html);
  // TODO: implement scraping using config
  return {};
}; 