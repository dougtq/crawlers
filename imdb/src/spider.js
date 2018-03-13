const request = require('request')
const cheerio = require('cheerio')
const fs = require('fs')

request('http://www.imdb.com/chart/moviemeter', (err, res, body) => {
  if (err) {
    console.dir(err)
    process.exit(1)
  }

  const $ = cheerio.load(body)

  $('.lister-list tr').each(function () {
    // console.log(this)
    const title = $(this).find('.titleColumn a').text()
    const rating = $(this).find('.imdbRating strong').text().trim() || '--'

    console.log(`Movie title: ${title}.`)
    console.log(`Movie rating: ${rating}.`)

    console.log('\n')

    fs.appendFileSync('imbd.txt', `Movie: ${title}, rating: ${rating}.\n`)
  })
})