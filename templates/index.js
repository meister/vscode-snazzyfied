import Sqrl from 'squirrelly';
import JSON5 from 'json5';
import { readFileSync } from 'fs';
import http from 'http';

const PORT = process.env.PORT || 1337;

async function render(template, data) {
	return Sqrl.render(template, { ...data, css: data.css });
}

function loadTemplate() {
	return readFileSync('templates/index.html', 'utf8');
}

function loadData(colorTheme) {
	return JSON5.parse(readFileSync(`themes/${colorTheme}-color-theme.json`, 'utf8'));
}


const server = http.createServer(async (request, response) => {
	const data = loadData('Snazzyfied');
	const template = loadTemplate();

	const headers = {
		'Content-Type': 'text/html',
	};

	let statusCode = 200;

	const body = await render(template, data);

	response.writeHead(statusCode, headers);
	response.end(body);
});

server.listen(PORT, () => {
	console.log(`Server listening on port :${PORT} 🚀`);
});