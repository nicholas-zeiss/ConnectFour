/**
 *
 *  Here we connect to the database with knex, creating our scores table and initializing its data if it does
 *  not yet exist.
 *
**/

const path = require('path');
const knex = require('knex')({
	client: 'sqlite3',
	connection: {
		filename: path.join(__dirname, '/data/data.sqlite')
	},
	useNullAsDefault: true
});


const createTable = () => (
	knex.schema
		.createTable('scores', table => {
			table.increments('id').primary();
			table.string('name');
			table.string('outcome');
			table.integer('turns');
			table.string('date');
		})
);

const fillers = new Array(10).fill({
	name: 'FOO',
	outcome: 'L',
	turns: 8,
	date: '01-01-70'
});

const padTable = () => (
	knex('scores')
		.insert(fillers)
		.then(() => console.log('padded table'))
		.catch(err => console.log(err))
);

const resetTable = () => createTable().then(padTable);


knex.schema
	.hasTable('scores')
	.then(exists => exists ? null : resetTable());


module.exports = { knex, resetTable };

