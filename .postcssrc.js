const JSON5 = require('json5');
const { readFileSync } = require('fs');
const { unflatten } = require('flat');

module.exports = {
	modules: false,
	plugins: {
		"autoprefixer": {},
		"postcss-simple-include": {},
		"postcss-variables": {
			globals: {
				siteWidth: '960px',
				colors: {
					primary: '#fff',
					secondary: '#000'
				},
				theme: unflatten(JSON5.parse(readFileSync('themes/Snazzyfied.json', 'utf8')))
			}
		}
	}
};