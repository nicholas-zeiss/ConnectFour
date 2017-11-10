/**
 *
 *	Responsible for handling user input for selecting a move through buttons; the event listener for the corresponding keypresses
 *	are instantiated in the parent component Game and create a click event for these buttons.
 *
**/

import React from 'react';


const Input = props => {

	const buttons = [];

	const addButtonRef = (button, i) => {
		buttons[i] = button;

		if (buttons.length == 7) {
			// pass buttons up to <Game/>
			props.moveButtonRef(buttons);
		}
	};
	
	const click = (i, e) => {
		const target = e.target;

		target.style.transform = 'translate(2px, 2px)';
		target.style.backgroundColor = '#106333';
		
		setTimeout(() => target.style.transform = 'translate(0, 0)', 60);
		setTimeout(() => target.style.backgroundColor = '#1e9e53', 100);
		
		props.makeMove(i);
	};

	return (
		<div id = 'input-container'>
			{
				new Array(7)
					.fill(1)
					.map((el, i) => 
						<button 
							disabled={ props.inputLock }
							id={ 'col-button--' + (i + 1) } 
							key={ i } 
							onClick={ click.bind(null, i) }
							ref={ button => button ? addButtonRef(button, i) : null }
							type='button' 
						>
							{ i + 1 }
						</button>
					)
			}
		</div>
	);
};


export default Input;

