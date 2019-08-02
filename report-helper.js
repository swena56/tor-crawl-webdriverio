import allureReporter from '@wdio/allure-reporter';
import HtmlHelper from './html-helper';
import Utility from './utility';
import fs from "fs";

class ReportReporter {

	/**
	 *  adds live config
	 */
	addLiveConfig(){
		let liveConfig = browser.execute(function () {
			return window.liveConfig;
		});

		allureReporter.addAttachment(
			'live config',
			HtmlHelper.jsonElement(liveConfig),
			"text/html"
		);

		return liveConfig;
	}

	elementScreenShot(element){
		const status = $(element).isExisting() ? 'passed' : 'failed';
		if( status === 'passed' ){
			const filename = `./errorShots/${Utility.generateUUID()}.png`;
			Utility.createDirectory('./errorShots');
			$(element).saveScreenshot(filename);
			const data = fs.readFileSync(filename);
			const base64 = new Buffer(data).toString('base64');
			allureReporter.addAttachment(`element screenshot: ${element}`,
				`<img src="data:image/png;base64, ${ base64 } " />`,
				'text/html'
			);
		}
		return $(element).isExisting();
	}

	screenShotAttachment( title="screenshot" ){
		return allureReporter.addAttachment(title,
			`<img src="data:image/png;base64, ${browser.takeScreenshot()} " />`,
			'text/html'
		);
	}

	jsonStringifyAttachment(data,title="json data"){
		allureReporter.addAttachment(
			title,
			HtmlHelper.jsonElement(data),
			"text/html"
		);
	}
}

export default new ReportReporter();
