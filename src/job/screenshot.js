// const path = require('path')

console.log('>>>>>>>>>>>>>>>>>>. process.argv: %o', process.argv[2])
paras = process.argv[2]
contains = paras.split(',')
// console.log('contains', contains)
// const puppeteer = require('puppeteer')
// const devices = require('puppeteer/DeviceDescriptors')
const pptrPool = require('./puppeteer-pool.js')
// const axios = require('axios')
// const tough = require('tough-cookie')
// const axiosCookieJarSupport = require('axios-cookiejar-support').default

// axiosCookieJarSupport(axios)
// const cookieJar = new tough.CookieJar()
const SELECTORS = {
  TYPE: contains[0],
  URL: contains[1],
  ROW: contains[2], // '.content-wrapper',
  PANEL: contains[3], // '.ivu-card'
  PICADDRESS: contains[4]
  // LOADING: '.panel-loading'
}

// const axiosAgent = axios.create({
//   baseURL: 'http://grafana.tuniu.org/mtuniu',
//   timeout: 1000,
//   jar: cookieJar, // tough.CookieJar or boolean
//   withCredentials: true, // If true, send cookie stored in jar
//   headers: {
//     accept: 'application/json',
//     'content-type': 'application/json'
//   }
// })
// const getLoginCookie = async () =>
//   axiosAgent.request({
//     url: '/login',
//     method: 'post',
//     data: global.__config__.grafana.login
//   })
// const getActualUser = async () =>
//   axiosAgent.request({
//     url: '/api/user',
//     method: 'get'
//   })
// const setLightTheme = async () =>
//   axiosAgent.request({
//     url: '/api/user/preferences',
//     method: 'put',
//     data: {
//       theme: 'light'
//     }
//   })
// .then(({ data }) => console.log(data))
// const setOrgContext = async () =>
//   axiosAgent.request({
//     url: '/api/user/using/15',
//     method: 'post'
//   })

const waitForPanel = async (page, panel, index) => {
  try {
    console.log(SELECTORS.PANEL)
    await panel.hover()
    await page
      .waitForFunction((index, SELECTORS) => document
        .querySelectorAll(SELECTORS.PANEL)[index]
        // .querySelector(SELECTORS.LOADING)
        .classList.contains('ivu-card-dis-hover'), {
        timeout: 3000
      }, index, SELECTORS)
  } catch (err) {
    console.error(err)
  }
}

const getSnapshot = async (url, app) => {
  console.log(url)
  // const datestamp = new Date().toISOString().split('T')[0]
  // let filename
  // if (app) {
  //   // filename = path.join(SELECTORS.PICADDRESS, `panel-${app}-${datestamp}.png`)
  //   filename = SELECTORS.PICADDRESS
  // } else {
  //   filename = SELECTORS.PICADDRESS
  //   // filename = path.join(SELECTORS.PICADDRESS, `panel-${datestamp}.png`)
  // }
  // console.log(filename)

  try {
    // await getLoginCookie()
    // await setLightTheme()
    // await setOrgContext()

    const browser = await pptrPool.acquire()
    const page = await browser.newPage()

    if (contains[0] === 'orderReport') {
      await page.setViewport({
        width: 1280,
        height: 2400
      })
    } else if (contains[0] === 'PackageRate') {
      await page.setViewport({
        width: 2000,
        height: 3000
      })
    } else {
      await page.setViewport({
        width: 1280,
        height: 2000
      })
    }

    // await page.setCookie(
    //   ...cookieJar.toJSON().cookies.map(n => ({
    //     name: n.key,
    //     value: n.value,
    //     domain: n.domain,
    //     path: n.path,
    //     httpOnly: n.httpOnly
    //   }))
    // )
    // await page.emulate(devices['iPhone 6'])
    await page.goto(url, {

      timeout: 18000,
      waitUntil: ['load', 'domcontentloaded', 'networkidle0']
      // waitUntil: ['load', 'domcontentloaded']
    })
    // await page.click('.ivu-collapse')
    // await page.screenshot({path: 'example.png'});
    // await page.screenshot({ path: filename, fullPage: true })

    // const panels = await page.$$('.panel-container')
    const row = await page.$(SELECTORS.ROW)
    const panels = await row.$$(SELECTORS.PANEL)

    /* eslint-disable no-restricted-syntax, no-await-in-loop */
    for (const [index, panel] of panels.entries()) {
      await waitForPanel(page, panel, index)
    }

    await page.mouse.move(1920, 0)

    await row.screenshot({
      path: SELECTORS.PICADDRESS,
      omitBackground: true
    })

    await page.close()
    pptrPool.release(browser)
    await browser.close()
    // console.log(resource)
    return SELECTORS.PICADDRESS
  } catch (err) {
    console.error(err)

    return err.message
  }
}

if (!module.parent) {
  ;
  (async () => {
    await getSnapshot(
      // eslint-disable-next-line global-require
      // require('../config/config.email.js').grafana.url
      // SELECTORS.URL
      // 'http://www.baidu.com',
      // 'http://10.28.32.130/support',
      // 'http://localhost:8082/support',
      SELECTORS.URL,
      SELECTORS.TYPE
    )
    // await pool.drain()
    // await pool.clear()
  })()
}
module.exports = {
  // getLoginCookie,
  // getActualUser,
  // setLightTheme,
  // setOrgContext,
  getSnapshot
}
