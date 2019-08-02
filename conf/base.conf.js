const video = require('wdio-video-reporter');

let excludes = [];
if( process.env.EXCLUDES ){
	let glob = require( 'glob' );
	let tests = glob.sync( 'test/**/*.spec.js' );
	let items = process.env.EXCLUDES.split(',');
	items.forEach((i)=>{
		let search_string = i.trim();
		let to_exclude = tests.filter( o => o && o.toLowerCase().includes(search_string) );
		excludes = excludes.concat(to_exclude);
	});
	excludes = excludes.map((o)=> `./${o}`);
}

exports.config = {
	runner: 'local',
	services: [],
	baseUrl: 'https://webdriver.io/',
	waitforTimeout: process.env.WAIT_FOR_TIMEOUT || 180000,
	waitforInterval: process.env.WAIT_FOR_INTERVAL || 40000,
	specFileRetries: process.env.SPEC_RETRIES || 0,
	maxInstances: process.env.MAX_INSTANCES || 10,
	maxInstancesPerCapability: 10,
	framework: 'mocha',
	bail: 0,
	specs: ['./test/*.spec.js'],
	filesToWatch: [],
	exclude: excludes,
	deprecationWarnings: true,
	networkConnectionEnabled: true,
	execArgv: [],
	logLevel: process.env.LOG_LEVEL || 'info',
	reporters: [
		'dot',
		'spec',
		['junit', {
			outputDir: './junit-results',
			outputFileFormat: function(options) {
				return `results-${options.cid}.${options.capabilities}.xml`
			}
		}],
		['json',{ outputDir: './allure-results/json'} ],
		[video, {
			outputDir: './allure-results/raw-video',
			saveAllVideos: false,
			videoSlowdownMultiplier: process.env.VIDEO_SLOW_DOWN || 5,
		}],
		['allure', {
			outputDir: './allure-results',
			disableWebdriverStepsReporting: true,
			disableWebdriverScreenshotsReporting: true,
		}],
	],
	mochaOpts: {
		ui: 'bdd',
		timeout: false,
	},
	onPrepare: function (config, capabilities) {
	},
	beforeSession: function (config, capabilities, specs) {
	},
	before: function (capabilities, specs) {
		const chai = require('chai');
		global.expect = chai.expect;
		chai.Should();
	},
	beforeSuite: function (suite) {
	},
	beforeHook: function () {
	},
	afterHook: function () {
	},
	beforeTest: function (test) {
	},
	beforeCommand: function (commandName, args) {
	},
	afterCommand: function (commandName, args, result, error) {
	},
	afterTest: function (test) {
		const { addFeature } = require('@wdio/allure-reporter').default;
		if (test.error !== undefined) {
			browser.takeScreenshot();
		}
	},
	afterSuite: function (suite) {
	},
	after: function (result, capabilities, specs) {
	},
	afterSession: function (config, capabilities, specs) {
	},
	onComplete: function (exitCode, config, capabilities, results) {
	},
	onReload: function(oldSessionId, newSessionId) {
	},
	beforeFeature: function (uri, feature) {
	},
	beforeScenario: function (uri, feature, scenario) {
	},
	beforeStep: function (uri, feature, scenario, step) {
	},
	afterStep: function (uri, feature, scenario, step, result) {
	},
	afterScenario: function (uri, feature, scenario, result) {
	},
	afterFeature: function (uri, feature) {
	}
};

