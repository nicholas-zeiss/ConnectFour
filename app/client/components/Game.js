/**
 *
 * This is the root component of the app. This component holds an instance of the ConnectFour class which is our model for the game. Aside from displaying 
 * the turn count and game status (in play, win loss, tie) the actual user interface is handled by subcomponents. 
 * All logic/processing for user input to the ConnectFour instance is contained here and passed down as callbacks to subcomponents.
 *
**/

import React from 'react';

import ConnectBoard from './ConnectBoard';
import GameControl from './GameControl';				
import Input from './Input';						
import Leaderboard from './Leaderboard';	
import SubmitScoreModal from './SubmitScoreModal';

import ConnectFour from '../utils/connectFour';
import { isEligible } from '../utils/leaderboardUtils';
import { getScores } from '../utils/serverCalls';


class Game extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			board: new ConnectFour(),
			canvasWidth: 400,
			canvasHeight: 300,
			eligible: false,						// if completed game is eligible to be on leaderboard
			inputLock: false,						// whether user can make a move or not
			leaderboard: [],						// top 10 high scores
			score: {
				player: 0,
				computer: 0
			},
			showModal: false,						// whether to show score submission modal
			status: 'in play',					// either 'in play', 'W', 'L', or 'T'
		};

		this.moveButtons = [];				// buttons that let player make a move, populated by a ref function passed to <Input/>

		getScores()
			.then(leaderboard => this.setState({ leaderboard }))
			.catch(err => console.log(err));
	}


	// Size the canvas appropriately based off of this.canvasDiv which is set in a ref,
	// also add listeners for a window resize to update those dimensions and for keypresses
	// used for player movement
	componentDidMount() {
		window.addEventListener('keypress', e => {
			if (!this.state.inputLock && 0 < Number(e.key) && Number(e.key) < 8) {
				this.moveButtons[e.key - 1] ? this.moveButtons[e.key - 1].click() : null;
			}
		});
		
		const setCanvasSize = () => this.setState({
			canvasHeight: .6 * (this.canvasDiv.offsetWidth - 60),
			canvasWidth: this.canvasDiv.offsetWidth - 60
		});

		window.onresize = setCanvasSize;
		setCanvasSize();
	}


	moveButtonRef = moveButtons => {
		this.moveButtons = moveButtons;
	}


	makePlayerMove = col => {
		if (this.state.board.isMoveLegal(col)) {			
			// 1 is the player chip, computer uses 2
			this.state.board.makeMove(col, 1);
			this.state.board.updateStatus();

			if (this.state.board.status == 'in play') {
				setTimeout(this.makeComputerMove, 500);			// delay for ux purposes
				this.setState({ inputLock: true });
				
			} else {							
				this.gameEnded();
			}
		}
	}
	

	makeComputerMove = () => {
		this.state.board.makeComputerMove();
		this.state.board.updateStatus();

		if (this.state.board.status == 'in play') {
			this.setState({ inputLock: false });
		} else {
			this.gameEnded();
		}
	}


	gameEnded() {
		const status = this.state.board.status;
		const score = Object.assign({}, this.state.score);

		if (status == 'W') {
			score.player++;	
		} else if (status == 'L') {
			score.computer++;
		}

		this.setState({
			eligible: isEligible(status, this.state.board.turnCount, this.state.leaderboard),
			score,
			status
		});
	}


	updateLeaderboard = leaderboard => {
		if (leaderboard) {
			this.setState({ leaderboard }, this.clearBoard);
		} else {
			this.clearBoard();
		}
	}


	clearBoard = () => {
		this.state.board.clear();
		
		this.setState({
			status: this.state.board.status,
			inputLock: false,
			eligible: false,
			showModal: false
		});
	}


	render() {
		const rightStatus = {
			'in play': 'Turn count: ' + this.state.board.turnCount,
			W: 'You win!',
			L: 'Computer wins!',
			T: 'Tie!'
		};

		const boardCopy = this.state.board.board
			.map(row => [ ...row ]);

		return (
			<div id='app'>		
				{
					this.state.showModal ? 
						<SubmitScoreModal 
							close={ this.updateLeaderboard }
							outcome={ this.state.status } 
							turns={ this.state.board.turnCount } 
						/>
						: null
				}
				
				<div id='header'>
					<h1>Connect Four</h1>
				</div>
				
				<div id='app-container'>
					<Leaderboard scores={ this.state.leaderboard }/>
				
					<div id='game-container'>
						<div id ='status'>	
							<h1 id='left-status'>Player: { this.state.score.player }&nbsp;&nbsp;Computer: { this.state.score.computer }</h1>
							<h1 id='right-status'>{ rightStatus[this.state.status] }</h1>
						</div>
						
						<div id='canvas-container' ref={ el => this.canvasDiv = el }>
							<ConnectBoard
								board={ boardCopy }
								height={ this.state.canvasHeight }
								width={ this.state.canvasWidth }
							/>
						</div>
						
						<Input
							inputLock={ this.state.inputLock }
							makeMove={ this.makePlayerMove }
							moveButtonRef={ this.moveButtonRef }
						/>
						
						<GameControl
							clearBoard={ this.clearBoard } 
							eligible={ this.state.eligible } 
							showModal={ this.setState.bind(this, { showModal: true }) }
							status={ this.state.status } 
						/>
					</div>
				</div>
			</div>
		);
	}
}


export default Game;

