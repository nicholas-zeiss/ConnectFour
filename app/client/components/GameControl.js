/**
Lets the user start a new game or, if eligible, choose to submit their score by opening the modal. Child of the Game component.
**/ 

import React from 'react';


const GameControl = (props) => {

	return (
		<div id='gameControl'>
			<button
				type='button'
				id='#submitScore'
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
			
