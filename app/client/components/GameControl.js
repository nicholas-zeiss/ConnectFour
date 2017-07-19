/**
Lets the user start a new game or, if eligible, choose to submit their score by opening the modal. Child of the Game component.
**/ 

import React from 'react';


const GameControl = (props) => {

	const onClick = e => {
		e.persist();
		if (e.target.id == 'newGame') {
			props.clearBoard();
		} else {
			props.showModal();
		}
		
		e.target.style.transform = 'translate(2px, 2px)';
		e.target.style.backgroundColor = '#106333';

		setTimeout(() => e.target.style.transform = 'translate(0, 0)', 60);
		setTimeout(() => e.target.style.backgroundColor = '#1e9e53', 100);
	}

	return (
		<div id='gameControl'>
			<button
				type='button'
				id='submitScore'
				disabled={!props.eligible}
				style={{visibility: props.eligible ? 'visible' : 'hidden'}}
				onClick={onClick}>
				Submit Score
			</button>
			<button id='newGame' onClick={onClick}>Reset</button>
		</div>
	);
}

export default GameControl;
			
