# Connect Proxy

Proxy a request to another server

# Usage

	proxy(host, port);

# Example

	var connect = require('connect')
		, proxy = require('connect-proxy')
		, app = connect.createServer();
	
	app.use('/images', proxy('internal-image-cluster.mysite.com'));
	app.use('/thumbs', proxy('internal-thumb-generator.mysite.com'));
	app.use('/legacy', proxy('some-old-iis-app.mysite.com', 8080));

	app.listen(3000);

# My Use Case

I have been in the process of converting our existing web applications to node.
In my connect routes my last ditch effort to handle a request unhandled by any
other middleware is to proxy it to a legacy backend server which serves up the
old version of the application. 

That way I can migrate portions of the existing application piece by piece and
register routes for those bits which have been migrated. If the URL is
unhandled then it seamlessly gets passed to a backend server.

# TODO

Add a way to mangle the request url or other request options
