/** 
initializes the react app and renders it to the DOM
**/

import Choose from './components/Choose';
import Game from './components/Game';
import GameOfLife from './components/GameOfLife';
import React from 'react';
import { render } from 'react-dom';

// const app = (
// 	<div>
// 		<h1 id='header'>Connect Four</h1>
// 		<Game></Game>
// 	</div>
// );

// const app = (
// 	<div>
// 		<h1>Conway's Game of Life</h1>
// 		<GameOfLife></GameOfLife>
// 	</div>	
// )

//renders our application to the DOM
render(<Choose/>, document.getElementById('root'));