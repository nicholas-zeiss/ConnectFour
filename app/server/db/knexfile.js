const path = require('path');
require('./createDb');

module.exports = {
	client: 'sqlite3',
	connection: {
		filename: path.join(__dirname, '/data/data.sqlite')
	},
	useNullAsDefault: true
};