/**
Displays the game status and let's the user start a new game
**/ 
import React from 'react';

const GameControl = (props) => {
	return (
		<div id='gameControl'>
			{props.status == 'in play' ? null : <h1 id='gameStatus'>{props.status}</h1>}
			<button id='newGame' onClick={props.clearBoard}>New Game?</button>
		</div>
	);
}

export default GameControl;