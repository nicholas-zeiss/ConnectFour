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

exports.clearScores = () => {
	return knex('scores').select().del();
}

exports.validateScore = (score) => {
	for (let key in score) {
		if (!['name','outcome','turns','date'].includes(key)) {
	    return false;
	  } else if (key == 'name' && (typeof score[key] != 'string' || score[key].length > 3)) {
			return false;
		} else if (key == 'outcome' && !['win','loss','tie'].includes(score[key])) {
			return false;
		} else if (key == 'turns' && typeof score[key] != 'number') {
			return false;
		} else if (key == 'date' && !/^\d{4}-\d{2}-\d{2}$/.test(score[key])) {
			return false;
		}
	}

	return true;
}