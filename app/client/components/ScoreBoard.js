/**
Renders the top 10 scores of all time, child of the Game component.
**/

import React from 'react';


const toggle = () => {
	let board = document.getElementById('scoresContainer');
	if (board.style.right == '0px') {
		board.style.right = '295px';
	} else {
		board.style.right = '0px';
	}
};

const ScoreBoard = props => {

	return (
		<div id='scoresContainer' onClick={toggle}>
			<div id='leaderboard'>
				<h1>Top 10 Games</h1>
				<table id='scoreTable'>
					<tbody>
						{
							props.scores.map(score => (
								<tr key={score.id}>
									<td>{score.id}.</td>
									<td>{score.name}</td>
									<td>{score.outcome}&nbsp;&nbsp;</td>
									<td>{score.turns}&nbsp;</td>
									<td>{score.date}</td>
								</tr>
							))
						}
					</tbody>
				</table>
			</div>
			<div id='expand'>
				&#8811;
			</div>
		</div>
	);
}

export default ScoreBoard;

