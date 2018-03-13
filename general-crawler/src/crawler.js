const request = require('request')
const cheerio = require('cheerio')
const URL = require('url-parse')

const search = require('./helpers/search')

const START_URL = 'http://www.arstechnica.com'
const SEARCH_WORD = 'ars'
const MAX_PAGES_TO_VISIT = 10

let numPagesVisited = 0
let pagesVisited = {}
const pagesToVisit = []
const url = new URL(START_URL)
const baseUrl = url.protocol + "//" + url.hostname;
pagesToVisit.push(START_URL)

crawl()

function crawl() {
  if(numPagesVisited >= MAX_PAGES_TO_VISIT) {
    console.log("Reached max limit of number of pages to visit.");
    return;
  }
  const nextPage = pagesToVisit.pop();
  if (nextPage in pagesVisited) {
    // We've already visited this page, so repeat the crawl
    crawl();
  } else {
    // New page we haven't visited
    if (nextPage) 
    visitPage(nextPage, crawl)
  }
}

function visitPage(url, callback) {
  // Add page to our set
  pagesVisited[url] = true;
  numPagesVisited++

  // Make the request
  console.log('Visiting page ' + url)
  request(url, (err, res, body) => {
    if (err) {
      console.error(err)
    }

    // Check status code (200 is HTTP OK)
    console.log("Status code: " + res.statusCode);
    if(res.statusCode !== 200) {
      callback();
      return;
    }
    // Parse the document body
    const $ = cheerio.load(body);
    const found = search($, SEARCH_WORD);
    if(found) {
      console.log('Word ' + SEARCH_WORD + ' found at page ' + url);
    }
    collectInternalLinks($);
    callback();
  });
}

function collectInternalLinks($) {
  const allRelativeLinks = []
  const allAbsoluteLinks = []

  const relativeLinks = $("a[href^='/']")
  relativeLinks.each(function () {
    allRelativeLinks.push($(this).attr('href'))
    pagesToVisit.push(baseUrl + $(this).attr('href'))
  })

  const absoluteLinks = $("a[href^='http']")
  absoluteLinks.each(function () {
    allAbsoluteLinks.push($(this).attr('href'))
    pagesToVisit.push($(this).attr('href'))
  })

  console.info("Found " + allRelativeLinks.length + " relative links")
  console.info("Found " + allAbsoluteLinks.length + " absolute links")

}
