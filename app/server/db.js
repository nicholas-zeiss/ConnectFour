const knex = require('knex')({
	client: 'sqlite3',
  connection: {
  	filename: './db/data.sqlite'
  }
});

knex.schema.createTableIfNotExists('highScores', (table) => {
	  table.increments('id').primary();
	  table.string('name', 3);
	  table.integer('w/l/t');
	  table.integer('turns');
	  table.date('date');
  }
);

const Bookshelf = require('bookshelf')(knex);

module.exports = Bookshelf;