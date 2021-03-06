/**
 *
 *	This is our modal for submitting a high score to the leaderboard. One can close the modal without a submission by clicking outside
 *	the modal, hitting the close button in the top right, or hitting escape.
 *
**/

import React from 'react';

import { formatDate } from '../utils/leaderboardUtils';
import { sendScore } from '../utils/serverCalls'; 


class SubmitScoreModal extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			name: '',
			showError: false
		};
	}


	componentDidMount() {
		window.addEventListener('keydown', this.keydownListener);
		
		// timeout to allow browser to render modal so that these height properties are accurate
		setTimeout(() =>{
			this.modalContent.style.top = (window.innerHeight - this.modalContent.clientHeight) / 2 + 'px';
		}, 0);
	}


	componentWillUnmount() {
		window.removeEventListener('keydown', this.keydownListener);
	}


	keydownListener = e => {
		if (e.key == 'Escape') {
			this.close.call(this, false);
		}
	}


	// Validates input to initials form, updates state and error message as appropriate
	changeName = e => {
		if (!/[^a-zA-Z]/g.test(e.target.value)) {
			let error = this.state.showError;

			if (error && e.target.value.length == 3) {
				error = false;
			}

			this.setState({
				name: e.target.value.toUpperCase(),
				showError: error
			});
		}
	}


	// If the submit button is clicked without a valid name we show the error message. If the name is valid
	// we delete the score we are replacing, if applicable, submit our score and close the modal.
	submit = e => {
		e.preventDefault();

		if (this.state.name.length == 3) {
			const score = {
				date: formatDate(),
				name: this.state.name,
				outcome: this.props.outcome,
				turns: this.props.turns
			};

			sendScore(score)
				.then(leaderboard => this.close(leaderboard))
				.catch(err => this.close(null));

		} else {
			this.setState({ showError: true });
		}
	}


	clickedOutside = e => {
		if (e.target == this.modal) {
			this.close(false);
		}
	}

	// allows the css transition of the modal rising to the top of the page to occur before this component unmounts
	close = leaderboard => {
		this.modalContent.style.top = -this.modalContent.clientHeight + 'px';
		setTimeout(() => this.props.close(leaderboard), 500);
	}


	render() {
		return (
			<div
				id='modal'
				onClick={ this.clickedOutside }
				ref={ modal => this.modal = modal }
			>
				<div
					id='modal-content'
					ref={ content => this.modalContent = content }
					style={ { bottom:'500px' } }
				>
					<button 
						id='close-modal' 
						onClick={ this.close.bind(null, false) }
						type='button' 
					>
						&times;
					</button>

					<h1> Congratulations! <br/><small> You&apos;ve earned a place on the leaderboard! </small></h1>
					
					<form id='submit-name'>
						<div id='submit-name-input'>
							<label>
								Initials: 
								<input 
									id='name-input'
									maxLength='3'
									minLength='3'
									onChange={ this.changeName }
									pattern='[A-Z]{3}'
									size='4'
									type='text' 
									value={ this.state.name }
									autoFocus
									required
								/>
							</label>

							<span style={ { visibility: this.state.showError ? 'visible' : 'hidden' } }>
								3 letters required
							</span>
						</div>

						<button 
							onClick={ this.submit }
							type='submit'
						>
							Submit
						</button>
					</form>
				</div>
			</div>
		);
	}
}


export default SubmitScoreModal;

