/**
Renders the top 10 scores of all time, child of the Game component.
**/

import React from 'react';


const ScoreBoard = (props) => {
	
	//make shallow copy in case there are < 10 scores and we need to pad the array so we still list 1 through 10
	let scores = props.scores.slice();

	for (let i = scores.length; i < 10; i++) {
		scores[i] = {
			name: '',
			outcome: '',
			turns: '',
			date: ''
		}
	}

	return (
		<div id='scoresContainer'>
			<h1>Top 10 Games</h1>
			<table id='highScores'>
				<thead>
					<tr>
						<th></th>
						<th>Name</th>
						<th>W/L/T</th>
						<th>Turns</th>
						<th>Date</th>
					</tr>
				</thead>
				<tbody>
					{
						scores.map((score, i) => 
							<tr key={i}>
								<td>{i + 1 + '.'}</td>
								<td>{score.name}</td>
								<td>{score.outcome}</td>
								<td>{score.turns}</td>
								<td>{score.date}</td>
							</tr>
						)
					}
				</tbody>
			</table>
		</div>
	);
}

export default ScoreBoard;
		
