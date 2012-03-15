var http = require('http');

module.exports = function (host, port) {
	host = host || "localhost";
	port = port || 80;

	return function (request, response) {
		request.headers.host = host;

		request.headers['x-forwarded-for'] = (request.headers['x-forwarded-for']) 
			? request.headers['x-forwarded-for'] + ', ' + request.socket.remoteAddress
			: request.socket.remoteAddress;

		var proxy_request = http.request({ 
			port : 		port, 
			host :		host, 
			method : 	request.method, 
			path :		request.url, 
			headers : 	request.headers
		}, function (proxy_response) {
			response.writeHead(proxy_response.statusCode, proxy_response.headers);

			proxy_response.addListener('data', function (chunk) {
				response.write(chunk, 'binary');
			});

			proxy_response.addListener('end', function () {
				response.end();
			});
		});

		request.addListener('data', function (chunk) {
			proxy_request.write(chunk, 'binary');
		});

		request.addListener('end', function () {
			proxy_request.end();
		});
	};
};
