/**
 *
 *	Here we have a few utilities for evaluating/manipulating the leaderboard
 *
**/


const scoreMap = {
	L: 0,
	T: 1000,
	W: 10000
};

const evalScore = score => scoreMap[score.outcome] + score.turns;

// Determines if a game is good enough for the leaderboard
export const isEligible = (score, board) => evalScore(score) > evalScore(board[board.length - 1]);

// Returns the current date in MM-DD-YY format
export const formatDate = () => {
	const now = new Date();
	
	const m = String(now.getMonth() + 1).padStart(2, '0');
	const d = String(now.getDate()).padStart(2, '0');
	const y = String(now.getFullYear() % 100).padStart(2, '0');
	
	return `${ m }-${ d }-${ y }`;
};

