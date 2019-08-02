import Utility from './utility';
import url from 'url';

class PageHelper {

	async aboutPage(){
		const urlString = await browser.getUrl() || '';
		let urlData = await url.parse(urlString.toString());
		return {
			...urlData,
			title: await browser.getTitle(),
			type: '',
			category: '',
			subject: '',

		};
	}
	getLinks(category = null){
		let links = browser.execute(()=>{
			let links = [];
			for( let i = 0; i < document.links.length; i++ ){
				const link = document.links[i].href;
				if( link && ! links.includes(link) ){
					links.push(link);
				}
			}
			return links;
		}).value;

		links = Utility.uniqueSort( links );

		if( category ){
			links = links.filter( o => o && o.includes(category) );
		}
		return links;
	}
	waitForPageInteractive(additionalWaitTime=0){
		try {
			let domState = '';
			browser.waitUntil( () => {
				domState = browser.execute(function () {
					return document.readyState;
				});
				return ( domState && ( domState === 'complete' || domState === 'interactive' ) ) ? true : false;
			});
		} catch(e) {
			console.log(e);
		}
		browser.pause(1500);
		if( additionalWaitTime > 0 ){
			browser.pause(additionalWaitTime);
		}
	}
}
export default new PageHelper();
