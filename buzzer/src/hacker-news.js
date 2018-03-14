const request = require('request')
const cheerio = require('cheerio')
const fs = require('fs')

request('https://news.ycombinator.com/news', function(err, res, body) {
  if(err) {
    console.error("err: " + err)
    process.exit(1)
  }
  
  console.info("Status code: " + res.statusCode)
  const $ = cheerio.load(body)

  $('tr.athing:has(td.votelinks)').each(function( index ) {
    const title = $(this).find('td.title > a').text().trim()
    const link = $(this).find('td.title > a').attr('href')
    fs.appendFileSync('hackernews.txt', `Title: ${title}\nLink: ${link}\n`)
  })

})