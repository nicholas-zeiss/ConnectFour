/**
This is the parent component of the app. This component holds an instance of the ConnectFour class which is our model for the game and holds the leaderboard.
Aside from a few pieces of information the actual user interface (ie our view) is handled by subcomponents. All logic for the user interacting with
the ConnectFour instance is contained here and passed down as props to subcomponents where they are displayed in the user interface.
This component handles the logic of running the game based off of the user input and updates the view as necessary.
**/

import React from 'react';

import ConnectFour from '../utils/connectFour';

import { isEligible, sortLeaderboard } from '../utils/leaderboardUtils';
import { deleteScore, getScores, sendScore } from '../utils/serverCalls';

import ConnectBoard from './ConnectBoard';
import GameControl from './GameControl';				
import Input from './Input';						
import Leaderboard from './Leaderboard';	
import SubmitScore from './SubmitScore';


class Game extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			board: new ConnectFour(),
			
			status: 'in play',					//either 'in play', 'W', 'L', or "T"
			score: [0, 0],							//player and computer respectively
			lock: false,								//if true user cannot make a move, used to force player to wait for computer movement or start new game
			
			leaderboard: [],
			eligible: false,
			
			canvasDiv: null,
			canvasWidth: 400,
			canvasHeight: 300
		};

		//to size the canvas responsively we must track the div holding ConnectBoard, we do so by passing this as a ref to that div
		this.updateCanvasDimensions = function(row) {					
			if (row) {
				this.setState({
					canvasHeight: .65 * row.offsetWidth, 
					canvasWidth: row.offsetWidth,
					canvasDiv: row
				});
			}
		}.bind(this);
	}

	//adds listeners to make moves for key presses from 1 - 7, toggles the button between active and inactive for css transition
	//adds a listener for a window resize so the dimensions of the canvas will update
	//calls the server for leaderboard information
	componentDidMount() {
		window.addEventListener('keypress', (e) => {
			if (!isNaN(e.key) && 0 < Number(e.key) && Number(e.key) < 8) {
				let btn = document.getElementById('col-button--'+ e.key);

				btn.className = 'active';
				
				setTimeout(() => btn.className = 'inactive', 125);
				
				this.selectColumn(Number(e.key) - 1);
			}
		});

		window.onresize = () => { 
			this.setState({
				canvasHeight: .65 * this.state.canvasDiv.offsetWidth,
				canvasWidth: this.state.canvasDiv.offsetWidth
			});
		};

		getScores(scores => this.setState({
			leaderboard: sortLeaderboard(scores)
		}));
	}



	//handles user movements
	selectColumn(col) {
		if (this.state.status == 'in play' && !this.state.lock && this.state.board.isMoveLegal(col)) {
			this.state.board.makeMove(col, 1);
			this.state.board.updateStatus();

			//make the computer's move if user didn't just win/tie
			if (this.state.board.status == 'in play') {			
				
			  this.updateState(true);		

			  //wait a short delay (for ux purposes) to make AI's move	
			  setTimeout(() => {
			  	this.state.board.updateStatus(this.state.board.makeComputerMove());
			  	this.updateState(false);
			  }, 500);
			
			} else {							
				//game just ended, update score				
			  this.updateState(true);
			}
		}
	}
	
	//updates game score, if game is in play or if not who win, locks/unlocks user input
	updateState(lock) {
		let status = this.state.board.status;
		let score = this.state.score;
		
		//determines is the player's game is good enough for the leaderboard, if so we give them to option to submit it
		let eligible = false;

		if (status != 'in play') {
			if (status == 'W') {
				score[0]++;
			
			} else if (status == 'L') {
				score[1]++;
			}

			//either less than 10 scores total so any game is eligible, if not evaluate
			eligible = this.state.leaderboard.length < 10 || isEligible({
				outcome: status,
				turns: this.state.board.turnCount
			}, this.state.leaderboard);
		}

		this.setState({
			status,
			score,
			lock,
			eligible
		});
	}

	//reset game
	clearBoard() {
		this.state.board.clear();
		
		this.setState({
			status: this.state.board.status,
			lock: false,
			eligible: false
		});
	}

	//if player submitted score to leaderboard we must reload it and start a new game with clearBoard
	updateLeaderboard() {
		getScores(scores => this.setState({
			eligible: false,
			leaderboard: sortLeaderboard(scores)
		}, this.clearBoard));
	}


	render() {
		return (
			<div>
				<div id='header'>
					<h1>Connect Four</h1>
				</div>
				
				<div id='appContainer'>
					
					<div id='gameContainer'>
						
						<div id ='status'>	
							<h1 id='leftStatus'>Player: {this.state.score[0]} Computer: {this.state.score[1]}</h1>
							<h1 id='rightStatus'>Turn count: {this.state.board.turnCount}</h1>
						</div>
						
						<div id='canvasContainer' ref={this.updateCanvasDimensions}>
							<ConnectBoard board={this.state.board.board} width={this.state.canvasWidth} height={this.state.canvasHeight}/>
						</div>
						
						<Input update={this.selectColumn.bind(this)}/>
						
						<GameControl status={this.state.status} eligible={this.state.eligible} clearBoard={this.clearBoard.bind(this)}/>
					
					</div>
					
					<div id='scoresContainer'>
						<h1>Top 10 Games</h1>
						
						<Leaderboard scores={this.state.leaderboard}/>
						
						{this.state.eligible  ? 
							<SubmitScore 
								outcome={this.state.status} 
								turns={this.state.board.turnCount} 
								leaderboard={this.state.leaderboard}
								update={this.updateLeaderboard.bind(this)}/>
							: null
						}
					</div>
				</div>
			</div>
		);
	}
}

export default Game;