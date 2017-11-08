/**
 *
 *  Here we have our utilities to manipulate the database using knex
 *
**/

const knex = require('./db');


exports.insertScore = score => knex('scores').insert(score);

exports.getScore = id => knex('scores').where({id}).select();

exports.getScores = () => knex('scores').select();

exports.deleteScore = id => knex('scores').where({id}).del();


const fillers = new Array(10).fill({
	name: 'FOO',
	outcome: 'L',
	turns: 8,
	date: '01-01-70'
});

// Clears table and pads with filler data, use with caution. The key is used to prevent any lazy accidental invocation.
exports.clearScores = key => {
	if (key == 'I really want to clear the table') {
		knex('scores')
			.select()
			.del()
			.then(() => {
				knex('scores')
					.insert(fillers)
					.then(() => console.log('cleared table'))
					.catch(err => console.log(err));
			});
	}
};


// Checks that the score object we receive in a POST is correctly formatted
exports.validateScore = score => {
	for (let key in score) {
		if (!['name','outcome','turns','date'].includes(key)) {
			return false;
		
		} else if (key == 'name' && (typeof score[key] != 'string' || score[key].length > 3)) {
			return false;
		
		} else if (key == 'outcome' && ![ 'W', 'L', 'T' ].includes(score[key])) {
			return false;
		
		} else if (key == 'turns' && typeof score[key] != 'number') {
			return false;
		
		} else if (key == 'date' && !/^\d{2}-\d{2}-\d{2}$/.test(score[key])) {
			return false;
		}
	}

	return true;
};

