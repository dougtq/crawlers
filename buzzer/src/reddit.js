const request = require('request')
const cheerio = require('cheerio')
const fs = require('fs')

request('https://www.reddit.com', function (err, res, body) {
  if (err) {
    console.log("err: " + err)
  }
  console.log("Status code: " + res.statusCode)

  const $ = cheerio.load(body)

  $('div#siteTable > div.link').each(function (i) {
    const title = $(this).find('p.title > a.title').text().trim()
    const score = $(this).find('div.score.unvoted').text().trim()
    const user = $(this).find('a.author').text().trim()
    console.log('Title: ' + title)
    console.log('Score: ' + score)
    console.log('User: ' + user)
    fs.appendFileSync('reddit.txt',`Title: ${title}\nScore: ${score}\nUser: ${user}\n`)
  })
})
