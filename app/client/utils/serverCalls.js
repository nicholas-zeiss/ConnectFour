

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


const getScores = cb => {
	fetch(`${window.location.href}scores`, {
		method: 'GET'
	})
	.then(res => res.json().then(cb));
}

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