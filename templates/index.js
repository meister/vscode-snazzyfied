import Sqrl from 'squirrelly';
import JSON5 from 'json5';
import { readFileSync } from 'fs';
import http from 'http';

const PORT = process.env.PORT || 1337;

async function render(template, data) {
	return Sqrl.render(template, { ...data, css: result.css });
}

function loadTemplate() {
	return readFileSync('templates/index.html', 'utf8');
}

function loadData() {
	return JSON5.parse(readFileSync('themes/Snazzyfied.json', 'utf8'));
}


const server = http.createServer(async (request, response) => {
	const data = loadData();
	const template = loadTemplate();

	const headers = {
		'Content-Type': 'text/plain',
	};

	let statusCode = 200;

	const body = await render(template, data);

	response.writeHead(statusCode, headers);
	response.end(body);
});

server.listen(PORT, () => {
	console.log(`Server listening on port :${PORT} 🚀`);
});