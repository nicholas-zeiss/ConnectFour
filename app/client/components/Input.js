/**
Responsible for handling user input for selecting a move through buttons; the event listener for the corresponding keypresses
are instantiated in the parent component Game.
**/

import React from 'react';


const Input = (props) => {

	return (
		<div id = 'inputContainer'>
			{
				new Array(7).fill(1).map((el, i) => 
					<button 
						type='button' 
						id={'col-button--' + (i + 1)} 
						key={i} 
						onClick={props.makeMove.bind(null, i)} 
						disabled={props.inputLock}>
						{i + 1}
					</button>
				)
		  }
		</div>
	);
}

export default Input;

