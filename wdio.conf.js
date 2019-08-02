let base = require('./conf/base.conf');

require('@babel/register')({
  presets: [[
    '@babel/preset-env',
    { targets: { node: 8 } },
  ]],
  babelrc: false,
});

exports.config = {
	...base.config,

    services: [
    	'sauce',
		'devtools',
        'chromedriver',
        'intercept',
		'selenium-standalone',
        //[ , {} ],
        // ['devtools', {
        //     debuggerAddress: '127.0.0.1:9222'
        // }],
    ],
    port: 9515,
    path: "/",

    capabilities: [{
        maxInstances: 1,
        browserName: 'chrome',
        'goog:chromeOptions': {
            //binary: `${require('puppeteer').executablePath()}`,
            //mobileEmulation: { deviceName: 'iPad' },
            args: [
                `--headless='${ !! process.env.SHOW_UI }'`,
                '--disable-gpu',
                "--window-size=1840,1080", "--disable-infobars", "--no-sandbox",
                '--remote-debugging-port=9222',
            ],
        },
    }],
    outputDir: `${__dirname}/logs`,

};
