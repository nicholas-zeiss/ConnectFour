const dbController = require('./dbController');
console.log('manipulating');

// dbController.insertScore('foo', 'bar', 5, '2017-01-01').then(foo => {
// 	console.log('promise resolved to', foo);
// 	dbController.getScores().then(rows => console.log(rows));
// });
dbController.getScores().then((foo) => {
	console.log('rows:\n', foo);
});