/**
Displays the game status and let's the user start a new game
**/ 
import React from 'react';

const GameControl = (props) => {
	return (
		<div id='gameOver'>
			{props.status == 'in play' ? null : <h1 id='gameStatus'>{props.status}</h1>}
			<h1 id='newGame' onClick={props.clearBoard}>New Game?</h1>
		</div>
	);
}

export default GameControl;