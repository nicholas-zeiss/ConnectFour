/**
Our server sends out our index.html along with our compiled JS in app/dist/ and our css in app/styles. The server also handles 
a few requests to manipulate the app's high scores which we keep in an SQL database we manipulate through knex js.
**/


const dbController = require('./db/dbController');


const bodyParser = require('body-parser');
const express = require('express');
const path = require('path');


const app = express();
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, '../../app')));


//renders the app
app.get('/', (req, res) => {
	res.sendFile('index.html');
});


//sends all leaderboard scores
app.get('/scores', (req, res) => {
	dbController.getScores()
	.then(rows => res.status(200).json(rows));
});


//receives a score to append to database, if score is invalid or the database cannot write it we return a 400 code
app.post('/scores', (req, res) => {
	
	if (dbController.validateScore(req.body)) {		
		dbController.insertScore(req.body)
		.then(id => {
			dbController.getScores()
			.then(rows => res.status(201).json(rows));
		})
		.catch(err => {
			console.log('failed to insert score: ', err);
			res.sendStatus(400);
		});
	
	} else {
		res.sendStatus(400);
	}
});


//Deletes a score from the database to clear space for a new score as we only store the ten highest.
//Sends a 400 code if the score specified by the id url parameter doesn't exist/didn't delete.
app.get('/delete/:id', (req, res) => {
	
	dbController.deleteScore(req.params.id)
	.then(deleteCount => {
		
		if (deleteCount) {
			dbController.getScores()
			.then(rows => res.status(200).json(rows));
		
		} else {
			res.sendStatus(400);	
		}
	});
});


//Used to wipe out the database and pad it with filler data
app.post('/clear', (req, res) => {
	
	if (req.body.key == 'I really want to clear the table') {
		dbController.clearScores(req.body.key)
		res.sendStatus(204);
	
	} else {
		res.sendStatus(403);
	}
})


const port = process.env.PORT || 6050;


app.listen(port, () => console.log('Listening on port ', port));

