const request = require('request')
const cheerio = require('cheerio')
const fs = require('fs')

request('http://www.buzzfeed.com', function(err, res, body) {
  if(err) {
    console.log("err: " + err);
  }
  console.log("Status code: " + res.statusCode);

  const $ = cheerio.load(body);

  $('.card').each(function(index) {
    const title = $(this).find('a').text().trim();
    // const author = $(this).find('div.small-meta > div:nth-child(1) > a').text().trim();
    // const ress = $(this).find('div.small-meta > div:nth-child(3) > a').text();
    
    fs.appendFileSync('buzzfeed.txt', `Title: ${title}\n`);
  });

});