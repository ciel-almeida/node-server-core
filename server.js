const http = require('http');
const fs = require('fs');
const url = require('url');

const hostName = 'localhost';
const port = 3000;

// Function responsible for dealing with the requests and responses
const requestHandler = function (request, response) {
	// Getting the url
	const q = url.parse(request.url, true);
	// name of the file without the /
	const filename = q.pathname.substring(1);

	// Sends html and css archives in the response
	const sendResponse = function (statusCode, file = filename) {
		//Extension of the file requested
		const extension = file.split('.')[1];

		// Reading the file and returning it with the right Header
		fs.readFile(file, function (err, data) {
			response.writeHead(statusCode, { 'Content-Type': `text/${extension}` });
			response.write(data);
			return response.end();
		});
	};

	// Routing for the requested files
	if (filename.includes('html') || filename.includes('css')) {
		if (fs.existsSync(filename)) {
			sendResponse(200);
		} else {
			sendResponse(404, '404.html');
		}
	}
	// Base path /
	else if (q.pathname === '/') {
		sendResponse(200, 'index.html');
	}
	// If the requested file isn't html of css
	else {
		sendResponse(404, '404.html');
	}
};

// Creating the server and passing the callback function to handle the requests and responses
const server = http.createServer(requestHandler);

// Starting the server and listening to the requests
server.listen(port, hostName, () => {
	console.log(`Server is running on: http://${hostName}:${port}`);
});
