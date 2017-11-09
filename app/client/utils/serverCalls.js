/**
 *
 *	Here we have the HTTP requests we need to make to interact with the leaderboard. Done using the Fetch API. 
 *	These functions take a callback to execute on the HTTP response's data.
 *
**/


const handleResponse = res => {
	if (res.status == 200) {
		return res.json();
	} else {
		throw res.status;
	}
};

// Receives the leaderboard in response.
export const getScores = () => (
	fetch('/scores', { method: 'GET' })
		.then(handleResponse)
);

// Sends a score to be added to the leaderboard, if successful we get the new leaderboard in response.
export const sendScore = score => (	
	fetch('/scores', {
		method: 'POST',
		body: JSON.stringify(score),
		headers: { 'Content-Type': 'application/json' }
	})
		.then(handleResponse)
);

