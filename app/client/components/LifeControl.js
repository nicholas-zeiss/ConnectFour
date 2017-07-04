import React from 'react';

const LifeControl = (props) => {
	return  (
		<div id='controls-container'>
			<button type='button' onClick={props.toggleAnimation}>Toggle Animation</button>
			<button type='button' onClick={props.clear}>Clear Board</button>
		</div>
	)
};

export default LifeControl;