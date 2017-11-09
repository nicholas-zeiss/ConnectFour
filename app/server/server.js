/**
 *
 *	Our server sends out our index.html along with our compiled JS in app/dist/ and our css in app/styles. The server also handles 
 *  a few requests to manipulate the app's high scores which we keep in an SQL database we manipulate through knex js.
 *
**/

const bodyParser = require('body-parser');
const express = require('express');
const path = require('path');

const dbController = require('./db/dbController');
const app = express();


app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, '../../app')));



//--------------------------------------------------------------
//												Helpers
//--------------------------------------------------------------

const scoreMap = {
	L: 0,
	T: 1000,
	W: 10000
};

const evalScore = score => scoreMap[score.outcome] + score.turns;

const sendScores = res => {
	dbController
		.getScores()
		.then(scores => res.status(200).json(scores))
		.catch(err => res.sendStatus(500));
};



//--------------------------------------------------------------
//												API Endpoints
//--------------------------------------------------------------

// renders the app
app.get('/', (req, res) => {
	res.sendFile('index.html');
});


// sends all leaderboard scores
app.get('/scores', (req, res) => sendScores(res));


// receives a score to append to database, checks score validity and updates database if valid
app.post('/scores', (req, res) => {
	if (dbController.validateScore(req.body)) {
		const newScore = evalScore(req.body);

		dbController
			.getScores()
			.then(scores => {
				for (var i = 0; i < scores.length; i++) {
					if (evalScore(scores[i]) < newScore) {
						dbController
							.setScore(req.body, i + 1)
							.then(sendScores.bind(null, res))
							.catch(err => res.sendStatus(500));

						return;
					}
				}
				// only reached if score not high enough to be in database
				res.sendStatus(400);
			})
			.catch(err => res.sendStatus(500));
	
	} else {
		res.sendStatus(400);
	}
});


// Used to wipe out the database and pad it with filler data
app.post('/clear', (req, res) => {
	if (req.body.key == 'I really want to clear the table') {
		dbController.clearScores(req.body.key);
		res.sendStatus(204);
	} else {
		res.sendStatus(403);
	}
});


app.listen(6050);

