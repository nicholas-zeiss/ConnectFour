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
			inputElement: null,
			name: '',
			showError: false
		};
	}


	componentDidMount() {
		window.addEventListener('keydown', this.keydownListener);
		
		// without the timeout the style will still change but no css transition occurs
		setTimeout(() =>{
			const modal = document.getElementById('modal-content');
			modal.style.bottom = '0px';
		}, 0);

		const inputElement = document.getElementById('name-input');
		
		this.setState({ inputElement });
	}


	componentWillUnmount() {
		window.removeEventListener('keydown', this.keydownListener);
	}


	keydownListener(e) {
		if (e.key == 'Escape') {
			this.close(false);
		} else if (e.key == 'Enter' && document.activeElement == this.state.inputElement) {
			this.submit();
		}
	}


	// Validates input to initials form, updates state and error message as appropriate
	changeName(e) {
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
	submit() {
		if (this.state.name.length == 3) {
			const score = {
				date: formatDate(),
				name: this.state.name,
				outcome: this.props.outcome,
				turns: this.props.turns
			};

			sendScore(score, this.close.bind(this, true));

		} else {
			this.setState({ showError: true });
		}
	}


	clickedOutside(e) {
		if (e.target == document.getElementById('modal')) {
			this.close(false);
		}
	}

	// allows the css transition of the modal rising to the top of the page to occur before this component unmounts
	close(reload) {
		let modal = document.getElementById('modal-content');

		modal.style.bottom = '1000px';

		setTimeout(this.props.close.bind(null, reload), 700);
	}


	render() {
		return (
			<div id='modal' onClick={ this.clickedOutside.bind(this) }>
				<div id='modal-content' style={ { bottom:'500px' } }>
					<button 
						id='close-modal' 
						onClick={ this.close.bind(this, false) }
						type='button' 
					>
						&times;
					</button>

					<h1> Congratulations! <br/><small> You&apos;ve earned a place on the leaderboard! </small></h1>
					
					<div id='submit-name'>
						<div id='submit-name-input'>
							<label> Initials: </label>
							
							<input 
								id='name-input'
								maxLength='3' 
								onChange={ this.changeName.bind(this) } 
								size='4'
								type='text' 
								value={ this.state.name }
							/>

							<span style={ { visibility: this.state.showError ? 'visible' : 'hidden' } }>
								3 letters required
							</span>
						</div>

						<button 
							onClick={ this.submit.bind(this) }
							type='button'
						>
							Submit
						</button>
					</div>
				</div>
			</div>
		);
	}
}


export default SubmitScoreModal;

