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

const evalScore = (outcome, turns) => scoreMap[outcome] + turns;

// Determines if a game is good enough for the leaderboard
export const isEligible = (outcome, turns, board) => {
	let toBeat = board[board.length - 1];
	return evalScore(outcome, turns) > evalScore(toBeat.outcome, toBeat.turns);
};

// Returns the current date in MM-DD-YY format
export const formatDate = () => {
	const now = new Date();
	
	const m = ('0' + (String(now.getMonth() + 1))).slice(-2);
	const d = ('0' + String(now.getDate())).slice(-2);
	const y = ('0' + String(now.getFullYear() % 100)).slice(-2);
	
	return `${m}-${d}-${y}`;
};

