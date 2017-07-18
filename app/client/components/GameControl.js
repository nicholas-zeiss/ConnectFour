/**
Displays the game status and lets the user start a new game, subcomponent of Game
**/ 

import React from 'react';

const GameControl = (props) => {

	return (
		<div id='gameControl'>
			<h1 id='gameStatus' style={{visibility:props.status == 'in play' ? 'hidden' : 'visible'}}>
				{props.status == 'in play' ? 'hidden placeholder' : 
				props.status == 'W' ? 'You win!' :
				props.status == 'L' ? 'The computer wins!' : 'It\'s a tie!'}
			</h1>
			<button id='newGame' onClick={props.clearBoard}>New Game?</button>
		</div>
	);
}

export default GameControl;