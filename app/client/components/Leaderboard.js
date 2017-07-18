/**
Renders the top 10 scores of all time, subcomponent of Game
**/


import React from 'react';

const Leaderboard = (props) => {
	let scores = props.scores.slice();

	//if there are less than 10 scores we pad the list with empty scores so that we still list 1 through 10
	for (let i = scores.length; i < 10; i++) {
		scores[i] = {
			name: '',
			outcome: '',
			turns: '',
			date: ''
		}
	}

	return (
		<table id='leaderboard'>
			<thead>
				<tr>
					<th id='position'></th>
					<th id='name'>Name</th>
					<th id='outcome'>W/L/T</th>
					<th id='turnCount'>Turns</th>
					<th id='date'>Date</th>
				</tr>
			</thead>
			<tbody>
				{scores.map((score, i) => {
					return (<tr key={i}>
						<td>{i + 1 + '.'}</td>
						<td>{score.name}</td>
						<td>{score.outcome}</td>
						<td>{score.turns}</td>
						<td>{score.date}</td>
					</tr>);
				})}
			</tbody>
		</table>
	);
}

export default Leaderboard;
		
