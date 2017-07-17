/**
As this web app is a single page with no backend data all express does is render index.html
**/
const bodyParser = require('body-parser');
const express = require('express');
const path = require('path');

const dbController = require('./db/dbController');

const app = express();
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, '../../app')));


app.get('/', (req, res) => {
	res.sendFile('index.html');
});


app.get('/scores', (req, res) => {
	dbController.getScores()
	.then(rows => res.status(200).json(rows));
});


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


app.get('/delete/:id', (req, res) => {
	dbController.deleteScore(req.params.id)
	.then(deleteCount => {
		if (deleteCount) {
			dbController.getScores()
			.then(rows => res.status(201).json(rows));
		} else {
			res.sendStatus(400);	
		}
	});
});



const port = process.env.PORT || 6050;

app.listen(port, () => console.log('Listening on port ', port));