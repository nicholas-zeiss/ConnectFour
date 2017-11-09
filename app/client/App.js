/** 
 *
 *  Initializes the react app and renders it to the DOM
 *
**/

import React from 'react';
import { render } from 'react-dom';

import Game from './components/Game';


render(<Game/>, document.getElementById('root'));

