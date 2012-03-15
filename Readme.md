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

# License

(The MIT License)

Copyright (c) 2012 Dan VerWeire

Permission is hereby granted, free of charge, to any person obtaining
a copy of this software and associated documentation files (the
'Software'), to deal in the Software without restriction, including
without limitation the rights to use, copy, modify, merge, publish,
distribute, sublicense, and/or sell copies of the Software, and to
permit persons to whom the Software is furnished to do so, subject to
the following conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY
CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT,
TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE
SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
