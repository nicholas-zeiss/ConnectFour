


function evalScore(score) {
	let modifier = ['L', 'T', 'W'].indexOf(score.outcome);

	return modifier > -1 ? [0, 1000, 10000][modifier] + score.turns : 0;
}

function isEligible(score, board) {
	return evalScore(score) > evalScore(board[board.length - 1]);
}

function sortLeaderboard(board) {
	return board.sort((a,b) => evalScore(b) - evalScore(a));
}


function formatDate() {
	return new Date()
	.toDateString().
	slice(4)
	.replace(/(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec) (\d{2}) (\d{4})/, 
		(match, month, day, year) => 
			`${('0' + (['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'].indexOf(month) + 1)).slice(-2)}-${day}-${year.slice(-2)}`
	);
}

export { formatDate, isEligible, sortLeaderboard };