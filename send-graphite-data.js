const GRAPHITE_SERVER_ADDRESS = process.env.GRAPHITE_SERVER_ADDRESS || new Error('Need to define env GRAPHITE_SERVER_ADDRESS');
const graphiteMessage = (metric, time, value) => Buffer.from(`${metric} ${value} ${time}\n`);
const timeSinceEpoch = () => Math.round(new Date().getTime()/1000);
const net = require('net');

/**
 *
 * @param path
 * @param value
 * @returns {Promise<any | void>}
 */
const sendDataTcp = ( path, value ) => {
	return new Promise( (resolve,reject) => {
		let message = graphiteMessage(path, timeSinceEpoch(), value );

		if( path && value ){
			const client = net.createConnection({ port: 2003, host: GRAPHITE_SERVER_ADDRESS }, () => {
				client.write(message.toString());
			});

			client.on('data', (data) => {
				client.end();
			});
			client.on('end', () => resolve(message.toString()) );
		} else {
			reject(`Invalid Data: '${message.toString()}'`);
		}
	}).catch( error => console.log(error) );
};

const sendDataUdp = ( path, value ) => {
	let message = graphiteMessage(path, timeSinceEpoch(), value );
	new Error('Not Implemented');
};

module.exports = {
	sendDataTcp,
	sendDataUdp
};
