function collectInternalLinks($) {
  const allRelativeLinks = []
  const allAbsoluteLinks = []

  const relativeLinks = $("a[href^='/']")
  relativeLinks.each(() => {
      allRelativeLinks.push($(this).attr('href'))
      pagesToVisit.push(baseUrl + $(this).attr('href'))
  })

  const absoluteLinks = $("a[href^='http']")
  absoluteLinks.each(() => {
      allAbsoluteLinks.push($(this).attr('href'))
  })

  console.info("Found " + allRelativeLinks.length + " relative links")
  console.info("Found " + allAbsoluteLinks.length + " absolute links")
}
