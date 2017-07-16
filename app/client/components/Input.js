/**
Responsible for handling user input for selecting a move through buttons; the event listener for the corresponding
keypresses are instantiated in Game.
**/

import React from 'react';

const Input = (props) => {
	return (
		<div id = 'buttonContainer'>
			{
				new Array(7).fill(1).map((el, i) => {
					return <button type='button' id={'col-button--' + (i + 1)} key={i} onClick={props.update.bind(null, i)}>{i + 1}</button>
				})
		  }
		</div>
	);
}

export default Input;