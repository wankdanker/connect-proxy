var http = require('http')
	, https = require('https')
	;

module.exports = function (options) {
	var host, secure, port, hostname;

	if (typeof options === 'string') {
		options = {
			host : arguments[0]
			, port : arguments[1]
			, secure : arguments[2]
		};
	}

	host = options.host || "localhost";
	secure = options.secure || false;
	port = options.port
		|| host.split(':')[1]
		|| ((secure) ? 443 : 80);

	host = host.split(':')[0];
	hostname = options.hostname || null;

	var libhttp = (secure) ? https : http;

	return function (request, response, next) {
		next = next || function () {};
		request.headers.host = hostname || host;

		request.headers['x-forwarded-for'] = (request.headers['x-forwarded-for']) 
			? request.headers['x-forwarded-for'] + ', ' + request.socket.remoteAddress
			: request.socket.remoteAddress
			;

		var proxy_request = libhttp.request({ 
			port : 	    port
			, host :    host
			, method :  request.method
			, path :    request.url
			, headers : request.headers
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
