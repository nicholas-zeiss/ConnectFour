/**
Responsible for handling user input to the game. It is passed down a method of the parent Game component which
allows it to update the game from there
**/

import React from 'react';

const Input = (props) => {
	return (
		<div id = 'buttonContainer'>
			{
				new Array(7).fill(1).map((el, i) => {
					return <button type='button' id={'col-button--'+(i + 1)} key={i} onClick={props.update.bind(null, i)}>{i + 1}</button>
				})
		  }
		</div>
	);
}

export default Input;