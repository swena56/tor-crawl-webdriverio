import fs from 'fs';
import url from 'url';

class Utility {
    numberWithCommas(x) {
        return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    }
    getFilesizeInBytes(filename) {
        if( fs.existsSync(filename) ){
            const stats = fs.statSync(filename);
            const fileSizeInBytes = stats.size;
            return fileSizeInBytes;
        } else {
            return 0;
        }
    }
    percentFixed(num){
        return parseFloat((num || 0) * 100.00).toFixed(2);
    }
    commify(num){
        return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    }
    formatBytes(bytes,decimals){
       if(bytes == 0) return '0 Bytes';
       var k = 1024,
           dm = decimals <= 0 ? 0 : decimals || 2,
           sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'],
           i = Math.floor(Math.log(bytes) / Math.log(k));
       return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
    }
    sleep(seconds){
        return new Promise(resolve => setTimeout(resolve, (seconds || 1) * 1000));
    }
    generateUUID(size=20){
        return Buffer.from(require('crypto').randomBytes(size), 'base64').toString('hex');
    }
    uniqueSort(array){
        return array.filter(function(elem, pos) {
            return array.indexOf(elem) == pos;
        }).sort() || [];
    }
    generateFileName(customText='screenshot'){
        let timestamp = new Date().toJSON().replace(/:/g, '-');
        let filename = customText + '-' + browser.desiredCapabilities.build + '-' + timestamp + '.png';
        return require('path').join(browser.options.screenshotPath, filename);
    }
    randomizeArray(array){
        return arrray.sort( function() { return 0.5 - Math.random() } );
    }
    getLinksInElement(element="body"){
        const links = ( element && $(element).isExisting() ) ? $(element).$$('a').map( o => o.getAttribute('href') ) : [];
        return this.uniqueSort(links).filter( o => ! ( o && url.parse(o).host && url.parse(o).host.includes('www.bestbuy.com') ) );
    }
    doesStringContainUuid(string){
        let regex = /.*[a-f\d]{8}-[a-f\d]{4}-[a-f\d]{4}-[a-f\d]{4}-[a-f\d]{12}.*/;
        return regex.test(string.toLowerCase());
    }
    createDirectory(dir){
		if (!fs.existsSync(dir)){
			fs.mkdirSync(dir);
		}
		return dir;
    }
    isValidUrl(url){
      if( ! url ) return false;
      return !! url.match(new RegExp("^(http[s]?:\\/\\/(www\\.)?|ftp:\\/\\/(www\\.)?|www\\.){1}([0-9A-Za-z-\\.@:%_\+~#=]+)+((\\.[a-zA-Z]{2,3})+)(/(.)*)?(\\?(.)*)?"));
    }
    chunkify(array, size) {
        const chunked_arr = [];
        for (let i = 0; i < array.length; i++) {
          const last = chunked_arr[chunked_arr.length - 1];
          if (!last || last.length === size) {
            chunked_arr.push([array[i]]);
          } else {
            last.push(array[i]);
          }
        }
        return chunked_arr;
    }


    parentComponent(elem){
        if( $(elem).isExisting() ){

            const element = browser.execute( (elem) => {
                return $(elem).parent().attr("id");
            },elementStr);

            return $(`#${element}`);
        }
    }
}

export default new Utility();
