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


const fillers = new Array(10).fill({
	name: 'FOO',
	outcome: 'L',
	turns: 8,
	date: '01-01-70'
});

knex.schema
	.hasTable('scores')
	.then(exists => {
		if (!exists) {
			knex.schema.createTable('scores', table => {
				table.increments('id').primary();
				table.string('name');
				table.string('outcome');
				table.integer('turns');
				table.string('date');
			})
				.then(() => knex('scores')
					.insert(fillers)
					.then(() => console.log('padded table'))
					.catch(err => console.log(err))
				);
		}
	});


module.exports = knex;

