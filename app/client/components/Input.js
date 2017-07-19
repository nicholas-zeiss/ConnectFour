/**
Responsible for handling user input for selecting a move through buttons; the event listener for the corresponding keypresses
are instantiated in the parent component Game.
**/

import React from 'react';


const Input = (props) => {
	

	const onClick = (i, e) => {
		e.persist();
		
		props.makeMove.call(null, i);

		e.target.style.transform = 'translate(2px, 2px)';
		e.target.style.backgroundColor = '#106333';

		setTimeout(() => e.target.style.transform = 'translate(0, 0)', 60);
		setTimeout(() => e.target.style.backgroundColor = '#1e9e53', 100);
	}

	return (
		<div id = 'inputContainer'>
			{
				new Array(7).fill(1).map((el, i) => 
					<button 
						type='button' 
						id={'col-button--' + (i + 1)} 
						key={i} 
						onClick={onClick.bind(null, i)} 
						disabled={props.inputLock}>
						{i + 1}
					</button>
				)
		  }
		</div>
	);
}

export default Input;

