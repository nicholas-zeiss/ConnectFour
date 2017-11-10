/**
 *
 *	Renders the top 10 scores of all time, child of the Game component.
 *
**/

import React from 'react';


const ScoreBoard = props => {

	let board;

	const toggle = () => {
		if (board.style.left == '0px') {
			board.style.left = '-295px';
		} else {
			board.style.left = '0px';
		}
	};

	return (
		<div id='leaderboard-container' onClick={ toggle } ref={ div => board = div }>
			<div id='leaderboard'>
				<h1> Top 10 Games </h1>
				
				<table id='score-table'>
					<tbody>
						{
							props.scores.map(score => (
								<tr key={ score.id }>
									<td>{ score.id }.</td>
									<td>{ score.name }</td>
									<td>{ score.outcome }&nbsp;&nbsp;</td>
									<td>{ score.turns }&nbsp;</td>
									<td>{ score.date }</td>
								</tr>
							))
						}
					</tbody>
				</table>
			</div>
			
			<div id='expand'> &#8811; </div>
		</div>
	);
};


export default ScoreBoard;

