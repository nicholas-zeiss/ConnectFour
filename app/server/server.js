/**
As this web app is a single page with no backend data all express does is render index.html
**/

const express = require('express');
const path = require('path');

const app = express();

app.use(express.static(path.join(__dirname, '../../app')));

app.get('/', (req, res) => {
	res.render('index.html');
});

const port = process.env.PORT || 6050;

app.listen(port, () => console.log('Listening on port ', port));