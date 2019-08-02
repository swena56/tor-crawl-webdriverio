exports.config = {
	user: process.env.SAUCE_USERNAME,
	key: process.env.SAUCE_ACCESS_KEY,
	services: [ 'sauce' ],
};
