'use strict';
let r = Math.trunc(Math.random() * 20) + 1, s = 20, h = +localStorage.getItem('highscore') || 0, $ = s => document.querySelector(s), m = msg => $('.message').textContent = msg;
const u = () => s > h && (localStorage.setItem('highscore', h = s), $('.highscore').textContent = h), x = () => $('.score').textContent = --s > 0 ? s : (m('🤯 You lost!'), document.body.style.backgroundColor = 'red', 0);
$('.check').onclick = () => {
    let g = +$('.guess').value;
    g ? g === r ? (m(s === 20 ? '😁 Cheater?' : '😁 Winner!'), document.body.style.backgroundColor = s === 20 ? '#d1d106' : '#60b347', u()) : (m(g > r ? '📉 Too high!' : '📈 Too low!'), x()) : m('😢 No number!');
};
$('.again').onclick = () => location.reload();
$('.highscore').textContent = h;
