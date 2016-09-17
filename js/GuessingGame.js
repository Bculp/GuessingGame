function generateWinningNumber() {
	return Math.ceil(Math.random() * 100);
}
function shuffle(array) {
 var m = array.length, t, i;

  // While there remain elements to shuffle…
  while (m) {

    // Pick a remaining element…
    i = Math.floor(Math.random() * m--);

    // And swap it with the current element.
    t = array[m];
    array[m] = array[i];
    array[i] = t;
  }

  return array;
}

function Game() {
	this.playersGuess = null;
	this.pastGuesses = [];
	this.winningNumber = generateWinningNumber();
}

Game.prototype.difference = function() {
	return Math.abs(this.playersGuess - this.winningNumber);
}
Game.prototype.isLower = function() {
	return (this.playersGuess < this.winningNumber);
}
Game.prototype.playersGuessSubmission = function(number) {
	if (number < 1 || number > 100 || isNaN(number)) {
		throw "That is an invalid guess.";
	}
	else {
		this.playersGuess = number;
		return this.checkGuess();
	}
}
Game.prototype.checkGuess = function() {
	if (this.playersGuess === this.winningNumber) {
		$('#hint, #submit').prop('disabled', true);
		$('#subtitle').text("Press RESET to play again!");
		return "You Win!";
	}
	else {

		if (this.pastGuesses.indexOf(this.playersGuess) != -1) {
		return "You have already guessed that number.";
		}

		else {
			this.pastGuesses.push(this.playersGuess);
			$('#guesslist li:nth-child(' + this.pastGuesses.length + ')').text(this.playersGuess);
			
			if (this.pastGuesses.length === 5) {
				$('#hint, #submit').prop('disabled',true);
				$('#subtitle').text("Press RESET to play again!");
				return "You Lose.";
			}
			else {
				if (this.isLower()) {
					$('#subtitle').text("Guess Higher!");
				}
				else {
					$('#subtitle').text("Guess Lower!");
				}

				if (this.difference() < 10) {
				return "You're burning up!";
				}
				else if (this.difference() < 25) {
					return "You're lukewarm.";
				}
				else if (this.difference() < 50) {
					return "You're a bit chilly.";
				}
				else {
					return "You're ice cold!";
				}
			}
		}
	}
}

function newGame() {
	return new Game();
}

Game.prototype.provideHint = function() {
	var arr = [this.winningNumber];
	while (arr.length < 3) {
		arr.push(generateWinningNumber());
	}
	return shuffle(arr);
}

//jquery
$(document).ready(function() {

var game = new Game();
var storeInputandClear = function() {
		var userInput = +$('#player-input').val();
		$('#player-input').val('');
		var output = game.playersGuessSubmission(userInput);
		$('#title').text(output);
	}

	$('#submit').on('click', storeInputandClear);
	$(document).on('keydown', function(event) {
		if (event.which === 13) {
			//run above code;
			storeInputandClear();
		}
	});
	//reset btn
	$('#resetbtn').on('click',function() {
		//create new game
		var game = new Game();
		//reset title & subtitle
		$('#title').text("Welcome to my guessing game!");
		$('#subtitle').text("Guess a number between 1-100!");
		//list of guesses isn't resetting but above are working
		$('.guess').text('-');
		$('#hint, #submit').prop('disabled',false);
	});	
	//hint btn
	$('#hintbtn').on('click', function() {
		var hint = game.provideHint();
		$('#title').text("The winning number is either " + hint);
	})

});
