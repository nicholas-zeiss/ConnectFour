/**
 *
 *  Here we have our utilities to manipulate the database using knex
 *
**/

const { knex, resetTable } = require('./db');


//--------------------------------------------------------------
//														Helpers
//--------------------------------------------------------------

// Checks that the score object we receive in a POST is correctly formatted
exports.validateScore = score => {
	for (let key in score) {
		switch(key) {
			case 'name':
				if (typeof score.name != 'string' || score.name.length != 3) return false;
				break;

			case 'outcome':
				if (!/[WLT]/.test(score.outcome)) return false;
				break;

			case 'turns':
				if (typeof score.turns != 'number' && score.turns < 8) return false;
				break;

			case 'date':
				if (!/^\d{2}-\d{2}-\d{2}$/.test(score.date)) return false;
				break;

			default:
				return false;
		}
	}

	return true;
};



//-----------------------------------------------------------
//												CRUD methods
//-----------------------------------------------------------

// Clears table and pads with filler data, use with caution. The key is used to prevent any lazy accidental invocation.
exports.clearScores = key => {
	if (key == 'I really want to clear the table') {
		knex.schema
			.dropTable('scores')
			.then(resetTable);
	}
};

exports.getScores = () => knex('scores').select();

exports.setScore = (score, id) => (
	knex('scores')
		.where({ id })
		.update(score)
);


