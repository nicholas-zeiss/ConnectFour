/**
 *
 *	Here we have the HTTP requests we need to make to interact with the leaderboard. Done using the Fetch API. 
 *	These functions can receive an optional callback to execute on the HTTP response's data.
 *
**/

/**

IMPT

FETCH IS NOT SUPPORTED IN MANY BROWSERS

ADD POLYFILL OR REPLACE W/ AXIOS


**/






// When we replace a score on the leaderboard we use this to delete it. Receives the new leaderboard in response.
const deleteScore = (id, cb) => {
	cb = cb || (() => {});

	fetch(`${window.location.href}delete/${id}`, {
		method: 'GET'
	})
		.then(res => res.json())
		.then(scores => cb(scores));	
};


// Receives the leaderboard in response.
const getScores = cb => {
	cb = cb || (() => {});

	fetch(`${window.location.href}scores`, {
		method: 'GET'
	})
		.then(res => res.json())
		.then(scores => cb(scores));
};


// Sends a score to be added to the leaderboard, if successful we get the new leaderboard in response.
// If not we get a 400 code.
const sendScore = (score, cb) => {
	cb = cb || (() => {});
	
	fetch(`${window.location.href}scores`, {
		method: 'POST',
		body: JSON.stringify(score),
		headers: {
			'Content-Type': 'application/json'
		}
	})
		.then(res => {
			if (res.status == 201) {
				return res.json();
			} else {
				return res.status;
			}
		})
		.then(res => cb(res));
};


export { deleteScore, getScores, sendScore };

