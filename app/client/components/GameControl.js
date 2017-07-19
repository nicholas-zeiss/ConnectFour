/**
Displays the game status and lets the user start a new game, subcomponent of Game
**/ 

import React from 'react';

const GameControl = (props) => {

	return (
		<div id='gameControl'>
			<button
				type='button'
				id='#score'
				disabled={!props.eligible}
				style={{visibility: props.eligible ? 'visible' : 'hidden'}}
				onClick={props.showModal}>
				Submit Score
			</button>
			<button id='newGame' onClick={props.clearBoard}>Reset</button>
		</div>
	);
}

export default GameControl;
			
			// <div id='controlButtons'>
			// </div>



			// <h1 id='gameStatus' style={{visibility:props.stat == 'in play' ? 'hidden' : 'visible'}}>
			// 	{props.status == 'in play' ? 'Computer wins!' : 
			// 	props.status == 'W' ? 'You win!' :
			// 	props.status == 'L' ? 'Computer wins!' : 'Tie!'}
			// </h1>