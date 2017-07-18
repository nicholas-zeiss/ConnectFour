
import React from 'react';

const Leaderboard = (props) => {
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
		<table id='leaderboard'>
			<thead>
				<tr>
					<th id='position'></th>
					<th className='name'>Name</th>
					<th className='outcome'>W/L/T</th>
					<th className='turnCount'>Turns</th>
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
		
