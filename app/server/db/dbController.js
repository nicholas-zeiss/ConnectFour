/**
Here we have our utilities to manipulate the database using knex
**/

const knex = require('knex')(require('./knexfile'));


exports.insertScore = (score) => {
	return knex('scores').insert(score);
}


exports.getScore = id => {
	return knex('scores').where({id}).select();
}


exports.getScores = () => {
	return knex('scores').select();
}


exports.deleteScore = id => {
	return knex('scores').where({id}).del();
}

//Clears table, use with caution. The callback is used to prevent any lazy accidental invocation.
exports.clearScores = cb => {
	if (cb() == 'Yes, clear the table') {
		return knex('scores').select().del();
	} else {
		return null;
	}
}

//Checks that the score object we receive in a POST is correctly formatted
exports.validateScore = (score) => {
	for (let key in score) {
		if (!['name','outcome','turns','date'].includes(key)) {
	    return false;
	  
	  } else if (key == 'name' && (typeof score[key] != 'string' || score[key].length > 3)) {
			return false;
		
		} else if (key == 'outcome' && !['W','L','T'].includes(score[key])) {
			return false;
		
		} else if (key == 'turns' && typeof score[key] != 'number') {
			return false;
		
		} else if (key == 'date' && !/^\d{2}-\d{2}-\d{2}$/.test(score[key])) {
			return false;
		}
	}

	return true;
}