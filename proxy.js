var http = require('http');

module.exports = function (host, port) {
	host = host || "localhost";
	port = port || 80;

	return function (request, response, next) {
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
			
			proxy_response.on('error', function (e) {
				next();
			});

			proxy_response.on('data', function (chunk) {
				response.write(chunk, 'binary');
			});

			proxy_response.on('end', function () {
				response.end();
			});
		});

		proxy_request.on('error', function (e) {
			next();
		});

		request.on('error', function (e) {
			next();
		});

		request.on('data', function (chunk) {
			proxy_request.write(chunk, 'binary');
		});

		request.on('end', function () {
			proxy_request.end();
		});
	};
};
