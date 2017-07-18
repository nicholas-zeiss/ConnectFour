/**
Here we have the HTTP requests we need to make to interact with the leaderboard. Done using the Fetch API. Each one is given a callback called to execute on the resulting
response data, if no manipulation of that data is needed one must still supply a callback that does nothing to avoid errors.
**/

//When we replace a score on the leaderboard we use this to delete it.
//If delete was successful we get the new leaderboard in response, a 400 code if not.
const deleteScore = (id, cb) => {
	fetch(`${window.location.href}delete/${id}`, {
		method: 'GET'
	})
	.then(res => {
		if (res.status == 200) {
			return res.json();
		} else {
			return res.status;
		}
	})
	.then(res => cb(res));	
}

//Receives the leaderboard in response.
const getScores = cb => {
	fetch(`${window.location.href}scores`, {
		method: 'GET'
	})
	.then(res => res.json().then(cb));
}

//Sends a score to be added to the leaderboard, if successful we get the new leaderboard in response.
//If not we get a 400 code.
const sendScore = (score, cb) => {
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
}

export { deleteScore, getScores, sendScore };