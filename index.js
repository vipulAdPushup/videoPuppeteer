const puppeteer = require('puppeteer');
const fs = require('fs');
const {isJson} = require("./utils/isJson");

const { harFromMessages } = require('chrome-har');

// list of events for converting to HAR
const events = [];

const extension = "./clickConsentBox";

const userAgent = 'Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:15.0) Gecko/20100101 Firefox/15.0.1'
const url = 'https://hindi.webdunia.com/';
const eventName = 'PRIMIS_FLOOR_ENGINE_DATA'
let adpushupVideojs = /https\:\/\/cdn.adpushup.com\/[0-9]+\/videoJsBundle.js/;
let urlPattern = /https\:\/\/securepubads.g.doubleclick.net\/gampad\/ads\?ui=/;
// to save data of whole session
const result = [];
const currTimeStamp = new Date().getTime();
const fileName = 'LINUX_BRAVE_1_';

(async () => {

  var siteId;

  const browser = await puppeteer.launch({
    headless:false,
    executablePath: '/opt/google/chrome/chrome',
    args: [
      `--disable-extensions-except=${extension}`, 
      `--load-extension=${extension}`,
      '--enable-automation',
      "--incognito"
    ]
    // executablePath: '/snap/brave/current/opt/brave.com/brave/brave',
  });
  const page = await browser.newPage();

  // await page.setRequestInterception(true);

  var finalJson = [];

  try{  

    await page.setViewport({ width: 1080, height:  880});
    await page.goto(url, {
        waitUntil: 'domcontentloaded',
        timeout: 0
    });

    page.evaluate(() => {
      window.allData = [];
      window.addEventListener("message", function(request){
        const dataStr = request.data;
        if(dataStr && dataStr.includes('gamData')){
          const tempData = JSON.parse(dataStr);
          for(var i=0; i<tempData.length; i++){
            if(tempData[i] != 'gamData'){
              window.allData.push(tempData[i]);
            }
          }
          console.log(tempData);
        }
      });    
    })

    // Uncomment to log data in console
    page.on('console', msg => console.log('PAGE LOG:', msg.text()));

  }catch(err){
    console.log(err.message)
  }

  await delay(90000);
  
  const gamData = await page.evaluate(() => {
    return window.allData
  });
  fs.writeFileSync("./test.json", JSON.stringify(gamData));
  await browser.close();

})();



function delay(time){
    return new Promise(function(resolve){
        setTimeout(resolve, time)
    });
}
