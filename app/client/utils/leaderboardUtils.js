/**
Here we have a few utilities for evaluating/manipulating the leaderboard
**/

//used in formatDate
const months = {
	Jan: '01',
	Feb: '02',
	Mar: '03',
	Apr: '04',
	May: '05',
	Jun: '06',
	Jul: '07',
	Aug: '08',
	Sep: '09',
	Oct: '10',
	Nov: '11',
	Dec: '12'
}


//Returns a number for any game outcome. Wins are always higher than ties which are always higher than losses. If outcome is the same
//the one with the longer turn count is higher.
function evalScore(score) {
	let modifier = ['L', 'T', 'W'].indexOf(score.outcome);

	return [0, 1000, 10000][modifier] + score.turns;
}

//Determines if a game is good enough for the leaderboard
function isEligible(score, board) {
	return evalScore(score) > evalScore(board[board.length - 1]);
}

//Sorts higher outcomes to the begging
function sortLeaderboard(board) {
	return board.sort((a,b) => evalScore(b) - evalScore(a));
}

//When submitting a score to the leaderboard we expect a date of MM-DD-YY. This function takes the date of score submission and formats it as such.
function formatDate() {
	//gives us "Jul 18 2017" for example 
	let date = new Date().toDateString().slice(4);

	return date.replace(/(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec) (\d{2}) (\d{4})/, (str, m, d, y) => `${months[m]}-${d}-${y.slice(-2)}`);
}

export { formatDate, isEligible, sortLeaderboard };