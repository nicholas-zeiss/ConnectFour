/**
This is the main page of the app. The Game component holds the instance of the ConnectFour class that represents the game.
It handles the logic of running the game based off of the user input and updates the view as necessary.
**/

import Board from './Board';									//responsible for displaying the board to the user
import ConnectFour from '../logic/connectFour';			//actual game model
import GameControl from './GameControl';				
import Input from './Input';							//handles user input
import Life from './Life';
import React from 'react';


const Game = React.createClass({
	getInitialState() {
		return {
			status: 'in play',		//tells us if the game is in play, is won (and by whom), or is tied
			board: new ConnectFour(),
			score: [0, 0],				//scores of the player and computer respectively
			lock: false						//if lock is true user cannot make a move, used to force player to wait for computer movement
		};
	},

	//adds listeners to make moves for key presses from 1 - 7, toggles the button between active and inactive for ux animation
	componentDidMount() {
		let listener = listen.bind(this);

		window.addEventListener('keypress', listener);

		function listen(event) {
			if (!isNaN(event.key) && 0 < +event.key && +event.key < 8) {					//checks if keypress is a number between 1 and 7 inclusively
				let btn = document.getElementById('col-button--'+ event.key);

				btn.className = 'active';															//toggles button to begin animation
				setTimeout(() => btn.className = 'inactive', 125);		//untoggles it to stop animation
				
				this.selectColumn(+event.key - 1);
			}
		}
	},

	//handles user movements
	selectColumn(col) {
		if (this.state.status == 'in play' && !this.state.lock && this.state.board.isMoveLegal(col)) {  //checks if game is till in play and player movement is legal
			//make the player's move
			this.state.board.makeMove(col, 1);
			this.state.board.updateStatus();

			if (this.state.board.status == 'in play') {			
				//make the computer's move
				
				//first update the state and lock it so that the player's move renders
				//land so that the player can't input a new piece until the computer moves
			  this.updateState(true);		

			  //after a short delay (for ux purposes) the alpha beta algorithm generates the computer's move and makes it	
			  setTimeout(() => {
			  	this.state.board.makeComputerMove();
			  	this.state.board.updateStatus();
			  	this.updateState(false);
			  }, 500);
			} else {							
				//computer can't make a move so update the state and cause the board to rerender				
			  this.updateState(false);
			}
		}
	},
	

	updateState(lock) {
		let state = this.state.board.status;
		let score = this.state.score;

		if (state == 'You win!') {
			score = [score[0] + 1, score[1]];
		} else if (state == 'The computer wins!') {
			score = [score[0], score[1] + 1];
		}

		this.setState({
			status: state,
			score: score,
			lock: lock
		});
	},


	clearBoard() {
		this.state.board.clear();
		this.setState({
			status: this.state.board.status
		});
	},


	render() {
		return (
			<div id='gameContainer'>
				<div id ='status'>	
					<h1 id='leftStatus'>Player: {this.state.score[0]} Computer: {this.state.score[1]}</h1>
					<h1 id='rightStatus'>Turn count: {this.state.board.turnCount}</h1>
				</div>
				<Board board={this.state.board.board}/>
				<Input update={this.selectColumn}/>
				<GameControl status={this.state.status} clearBoard={this.clearBoard}/>
			</div>
		);
	}
});

export default Game;