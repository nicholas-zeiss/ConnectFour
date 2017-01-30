/** 
initializes the react app and renders it to the DOM
**/

import React from 'react';
import { render } from 'react-dom';
import Game from './components/Game'

const app = (
	<div>
		<h1 id='header'>Connect Four</h1>
		<Game></Game>
	</div>
);

//renders our application to the DOM
render(app, document.getElementById('root'));