'use strict';

let randomNumber = Math.trunc(Math.random() * 20) + 1;
// sdocument.querySelector('.number').textContent = randomNumber;

let score = 20;
let highscore = Number(localStorage.getItem('highscore')) || 0;

const displayMessage = message => document.querySelector('.message').textContent = message;

const updateHighscore = () => {
    if (score > highscore) {
        highscore = score;
        localStorage.setItem('highscore', highscore);
        document.querySelector('.highscore').textContent = highscore;
    }
};

const modifyScore = () => {
    if (score > 1) {
        score--;
        document.querySelector('.score').textContent = score;
    } else {
        displayMessage('🤯 You lost the game!');
        document.querySelector('.score').textContent = 0;
        document.body.style.backgroundColor = 'red'; // Set background to red for losing
        document.querySelector('.number').textContent = randomNumber;
    }
};

const resetGame = () => location.reload(); // Reload the page to reset the game

document.querySelector('.check').addEventListener('click', () => {
    const guess = Number(document.querySelector('.guess').value);
    if (!guess) {
        displayMessage('😢 No number entered!');
    } else if (guess === randomNumber) {
        displayMessage('😁 You won the game!');
        document.body.style.backgroundColor = '#60b347'; // Set background to green for winning
        updateHighscore();
        if (score === 20) {
            displayMessage('Are you sure you did not cheat?');
            document.body.style.backgroundColor = '#d1d106'; // Set background to yellow for cheaters
        }
    } else {
        displayMessage(guess > randomNumber ? '📉 Too high!' : '📈 Too low!');
        modifyScore();
    }
});

document.querySelector('.again').addEventListener('click', resetGame);
document.querySelector('.highscore').textContent = highscore;
