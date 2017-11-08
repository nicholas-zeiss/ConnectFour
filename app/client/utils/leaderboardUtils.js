/**
 *
 *	Here we have a few utilities for evaluating/manipulating the leaderboard
 *
**/

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
};


// Returns a number score for any finished game. Wins are always higher than ties which are always higher than losses. If outcome is the same
// the one with the longer turn count is higher.
function evalScore(score) {
	let modifier = ['L', 'T', 'W'].indexOf(score.outcome);

	return [0, 1000, 10000][modifier] + score.turns;
}


// Determines if a game is good enough for the leaderboard
function isEligible(score, board) {
	return evalScore(score) > evalScore(board[board.length - 1]);
}


// Sorts array of scores, descending
function sortLeaderboard(board) {
	return board.sort((a,b) => evalScore(b) - evalScore(a));
}


// When submitting a score to the leaderboard we expect a date string MM-DD-YY. This function takes the current date and formats it as such.
function formatDate() {
	const now = new Date();
	return `${now.getMonth() + 1}-${now.getDate()}-${now.getFullYear() % 100}`;
}


export { formatDate, isEligible, sortLeaderboard };

