import allureReporter from '@wdio/allure-reporter';
import JunitHelper from '../junit-helper';
import HtmlHelper from '../html-helper';
import ReportHelper from '../report-helper';
import PageHelper from '../page-helper';
import Utility from '../utility';
import url from 'url';

let urlString = process.env.URL;
if( ! urlString ) throw new Error('Need env variable URL');

/**
 * TODO
 * - scale screenshots
 * - scan all categories
 * - parse junit
 * - Improve description
 * - screenshot of each href
 * - link to level 2
 * - if level 2 or greater provide the level change link
 */
describe(`Results`, function () {

	it('by using async/await', async () => {
		const puppeteer = browser.getPuppeteer();
		const page = (await puppeteer.browser.pages())[0];
		console.log(await page.title())
	});

	it(`level 1: ${urlString}`, function () {
		browser.enablePerformanceAudits();
		browser.url(urlString);
		const connection = browser.cdpConnection();
		console.log(connection);
		browser.cdp('Profiler', 'enable');
		browser.cdp('Debugger', 'enable');

		// let metrics = browser.getMetrics();
		// expect(metrics.speedIndex < 1500).to.equal(true);

		// let score = browser.getPerformanceScore();
		// expect(score >= .99).to.equal(true);


		browser.setCookies({name: 'EtkDeviceName', value: `PIT`});
		browser.refresh();

		let results = [];
		browser.cdp('Network', 'enable');
		browser.on('Network.responseReceived', (params) => {
			results.push({
				status: params.response.status,
				url: params.response.url,
			});
		});

		browser.cdp('Network', 'disable');

		// if( browser.options.services.includes('devtools') ) {
		// 	browser.cdp('Network', 'enable');
		// 	browser.on('Network.responseReceived', (params) => {
		// 		results.push({
		// 			status: params.response.status,
		// 			url: params.response.url,
		// 		});
		// 	});
		// }

		browser.pause(4000);
		console.log(results);
		//get level and referrer data from junit results
		let currentUrl = browser.call( async () => {
			let data = await PageHelper.aboutPage();
			const testData = await JunitHelper.getTestCases();
			return { ...data, level: 1, referrer: null, test: testData };
		});

		allureReporter.addArgument('title', currentUrl.title );
		allureReporter.addArgument('url', currentUrl.href );
		allureReporter.addArgument('type', currentUrl.type );
		allureReporter.addArgument('referrer', null);
		allureReporter.addArgument('level', currentUrl.level);

		//misc
		allureReporter.addEnvironment('name', 'value');
		allureReporter.addIssue('Issue-id');
		allureReporter.addTestId('Issue-id');
		allureReporter.addFeature('Feature');
		allureReporter.addStory('Story');
		allureReporter.addSeverity('Bad');

		//steps
		ReportHelper.addLiveConfig();
		ReportHelper.elementScreenShot('#header');
		ReportHelper.elementScreenShot('#footer');

		//link data
		let contentLinks = $('main').$$('a') || [];
		allureReporter.addArgument('total-links-count', `${contentLinks.length}`);

		let found = {};
		for (let i = 0; i < contentLinks.length; i++) {
			const href = contentLinks[i].getAttribute('href') || false;
			if ( Utility.isValidUrl(href) ) {
				const urlData = url.parse(href);
				if ( ! found[href] && urlData['path'] !== '/' ) {
					found[href] = contentLinks[i];
				}
			}
		}

		const hrefs = Object.keys(found);
		allureReporter.addAttachment('data', JSON.stringify(hrefs), 'json');
		allureReporter.addArgument('unique-links-count', `${hrefs.length}`);

		//description
		allureReporter.addDescription(
			HtmlHelper.getHtmlTemplate(
				HtmlHelper.splitElementContainer(
					'ScreenShot A',
					'ScreenShot B'
				)
			),
			'html'
		);
		expect(false).to.equal(true);
	});



});
