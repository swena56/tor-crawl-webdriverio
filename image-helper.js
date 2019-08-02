import Jimp from "jimp";

class ImageHelper {
	filenameToBase64(filename) {
		return new Promise(resolve => {
			browser.pause(1000);
			Jimp.read(filename, function (err, image) {
				if (err) throw err;
				image.resize(Jimp.AUTO, height)//.scale(80)
					.quality(quality)
					.getBase64(Jimp.AUTO, function (err, data) {
						resolve(data);
					});
			});
		});
	}
	getScreenShotBase64(filename, height = 800, quality = 60) {
		return new Promise(resolve => {
			browser.pause(1000);
			Jimp.read(browser.takeScreenshot(), function (err, image) {
				if (err) throw err;
				image.resize(Jimp.AUTO, height)//.scale(80)
					.quality(quality)
					.getBase64(Jimp.AUTO, function (err, data) {
						resolve(data);
					});
			});
		});
	}
}
export default new ImageHelper();
