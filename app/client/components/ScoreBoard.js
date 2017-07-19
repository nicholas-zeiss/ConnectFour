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

	let visible = false;

	const toggle = (e) => {
		let board = document.getElementById('scoresContainer');
		if (board.style.right == '0px') {
			board.style.right = '295px';
			visible = false;
		} else {
			board.style.right = '0px';
			visible = true;
		}
	}

	return (
		<div id='scoresContainer' onClick={toggle}>
			<div id='leaderboard'>
				<h1>Top 10 Games</h1>
				<table id='scoreTable'>
					<tbody>
						{
							scores.map((score, i) => 
								<tr key={i}>
									<td>{i + 1 + '.'}</td>
									<td>{score.name}</td>
									<td>{score.outcome}&nbsp;&nbsp;</td>
									<td>{score.turns}&nbsp;</td>
									<td>{score.date}</td>
								</tr>
							)
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

