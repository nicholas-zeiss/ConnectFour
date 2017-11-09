/**
 *
 *	Lets the user start a new game or, if eligible, choose to submit their score by opening the modal. Child of the Game component.
 *
**/ 

import React from 'react';


const GameControl = props => {
	const onClick = e => {
		const target = e.target;

		target.id == 'newGame' ? props.clearBoard() : props.showModal();
		target.style.transform = 'translate(2px, 2px)';
		target.style.backgroundColor = '#106333';

		setTimeout(() => target.style.transform = 'translate(0, 0)', 60);
		setTimeout(() => target.style.backgroundColor = '#1e9e53', 100);
	};

	return (
		<div id='gameControl'>
			<button
				disabled={ !props.eligible }
				id='submitScore'
				onClick={ onClick }
				style={ { visibility: props.eligible ? 'visible' : 'hidden' } }
				type='button'
			>
				Submit Score
			</button>

			<button id='newGame' onClick={ onClick }>
				Reset
			</button>
		</div>
	);
};


export default GameControl;
			
