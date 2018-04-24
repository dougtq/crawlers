require('dotenv').config()
const puppeteer = require('puppeteer')

const user_input = '#login_field'
const pass_input = '#password'
const send_btn = '#login > form > div.auth-form-body.mt-3 > input.btn.btn-primary.btn-block'
const name_user = '#js-pjax-container > div > div.columns > div.column.three-fourths.codesearch-results > div > ul > div:nth-child(1) > div.col-8.pr-3 > h3 > a'
const email_user = '#user_search_results > div > div > div.d-flex > div > ul > li:nth-child(2) > a'

async function run () {
  const LENGTH_SELECTOR_CLASS = 'user-list-item';
  const browser = await puppeteer.launch({ headless: (process.env.ENV === 'dev') ? false : true })
  
  try {
    const page = await browser.newPage() 
    await page.goto('https://github.com/login', { timeout: 99999999 })

    await page.click(user_input);
    await page.keyboard.type(process.env.GITUSER);

    await page.click(pass_input);
    await page.keyboard.type(process.env.GITPASSWORD);

    await page.click(send_btn);

    await page.waitForNavigation({
      timeout: 99999999
    });
    
    const userToSearch = 'john';
    const searchUrl = `https://github.com/search?q=${userToSearch}&type=Users&utf8=%E2%9C%93`;
    
    await page.goto(searchUrl);
    await page.waitFor(2*1000);
    
    const listLength = await page.evaluate((sel) => {
      return document.getElementsByClassName(sel).length;
    }, LENGTH_SELECTOR_CLASS);

    for (let i = 1; i <= listLength; i++) {
      // change the index to the next child
      let usernameSelector = name_user.replace("INDEX", i);
      let emailSelector = email_user.replace("INDEX", i);
  
      let username = await page.evaluate((sel) => {
          console.log(sel)          
          return document.querySelector(sel).getAttribute('href').replace('/', '');
        }, usernameSelector);
  
      let email = await page.evaluate((sel) => {
          return (document.querySelector(sel)) ? document.querySelector(sel).innerHTML : null;
        }, emailSelector);
  
      // not all users have emails visible
      if (!email || !email.length)
        continue;
  
      console.log(username, ' -> ', email);
  
      // TODO save this user
  }

  } catch (err) {
    console.error('Oops: ', err)
    browser.close()
  }
}

run();