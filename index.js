const puppeteer = require('puppeteer-extra')
const StealthPlugin = require('puppeteer-extra-plugin-stealth')
puppeteer.use(StealthPlugin())

puppeteer.launch({ 
    headless: false,
    executablePath: "Path/to/Chrome.exe",
    userDataDir: "Path/to/Chrome Profile"
})
.then(async browser => {
    console.log('Running tests..');
    const page = await browser.newPage();
    await page.setViewport({ width: 1500, height: 950 });
    await page.goto('https://www.apnacollege.in/', {waitUntil: 'load'});
    try{
        const loginBtn = await page.$('#menuItem5');
        await loginBtn.click();
        await page.type('.-email-input', 'gmail.com');
        await page.type('.-pass-input', '');
        const submitBtn = await page.$('#submitLogin');
        await submitBtn.click();
    }
    catch{
        console.log("Already logged in...");
    }
    finally{
        await page.goto('', {waitUntil: 'load'});
        await page.waitForTimeout(5000);
        let i = 5;
        while(true){
            if(i > 51){
                break;
            }
            const content = await page.$(`#lpathContents > li:nth-child(${i})`);
            await content.click();
            const ulChildren = await page.$$(`#lpathContents > li:nth-child(${i}) > ul > li`);
            let j = 1;
            for (const video of ulChildren) {
                await video.click();
                let captured = false;
                page.on("request", (request) => {
                    if(!captured){
                        const url = request.url();
                        if (url.startsWith("https://embed-cloudfront.wistia.com/deliveries/") && url.endsWith(".m3u8")) {
                            console.log(url);
                        }
                    }
                });
                await page.waitForTimeout(5000);
                j++;
                if (j > 51) {
                    break;
                }
            }
            i++;
        }
    }
})
