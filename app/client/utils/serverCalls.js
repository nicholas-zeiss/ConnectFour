/**
 *
 *	Here we have the HTTP requests we need to make to interact with the leaderboard. Done using the Fetch API. 
 *	These functions take a callback to execute on the HTTP response's data.
 *
**/


// Receives the leaderboard in response.
const getScores = cb => {
	fetch('/scores', { method: 'GET' })
		.then(res => res.json())
		.then(cb);
};


// Sends a score to be added to the leaderboard, if successful we get the new leaderboard in response.
// If not we get a 400 code.
const sendScore = (score, cb) => {
	cb = cb || (() => {});
	
	fetch('/scores', {
		method: 'POST',
		body: JSON.stringify(score),
		headers: { 'Content-Type': 'application/json' }
	})
		.then(res => {
			if (res.status == 200) {
				return res.json();
			} else {
				return res.status;
			}
		})
		.then(cb);
};


export { getScores, sendScore };

