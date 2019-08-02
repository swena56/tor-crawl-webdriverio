import fs from 'fs';
import glob from 'glob';
import xml2js from 'xml2js';

class JunitHelper {

	getXmlFiles(dir = 'allure-results'){

	}

	async getTestCases() {
		const parser = new xml2js.Parser();
		let tests = glob.sync( 'allure-results/*.xml' );
		let data = [];
		for (let i = 0; i < tests.length; i++) {
			const xml = fs.readFileSync(tests[i]).toString();
			let testCase = await new Promise( (resolve, reject ) => {
				parser.parseString(xml, function (err, result) {
					resolve(result['ns2:test-suite']['test-cases']);
				});
			});
			await data.push(testCase);
			//console.log(JSON.stringify(testCase,null,'\t'));
		}
		return data;
	}

	getReferrerImage(){

	}

	getLevel( urlString ){

	}

	getAttachments(){

	}
}
export default new JunitHelper();
