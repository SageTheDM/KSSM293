// Arrow function to calculate the average of 3 scores
const calcAverage = (score1, score2, score3) => (score1 + score2 + score3) / 3;

// Function to check the winner based on the provided rule
const checkWinner = (team1, team2, avgTeam1, avgTeam2) => {
    if (avgTeam1 >= 2 * avgTeam2) {
        return `${team1} win (${avgTeam1} vs. ${avgTeam2})`;
    } else if (avgTeam2 >= 2 * avgTeam1) {
        return `${team2} win (${avgTeam2} vs. ${avgTeam1})`;
    } else {
        return 'No team wins.';
    }
};

// Function to process scores and team names entered by the user
function processScores() {
    const team1Name = document.getElementById('team1Name').value || 'Team 1';
    const team2Name = document.getElementById('team2Name').value || 'Team 2';
    const team1ScoresInput = document.getElementById('team1Scores').value;
    const team2ScoresInput = document.getElementById('team2Scores').value;

    try {
        const team1Scores = team1ScoresInput.split(',').map(Number);
        const team2Scores = team2ScoresInput.split(',').map(Number);

        if (team1Scores.length !== 3 || team2Scores.length !== 3) {
            throw new Error('Please enter exactly 3 scores for each team.');
        }

        const avgTeam1 = calcAverage(...team1Scores);
        const avgTeam2 = calcAverage(...team2Scores);

        const winnerMessage = checkWinner(team1Name, team2Name, avgTeam1, avgTeam2);
        document.getElementById('winnerMessage').textContent = winnerMessage;

        generateGraph(team1Name, avgTeam1, team2Name, avgTeam2);
    } catch (error) {
        document.getElementById('winnerMessage').textContent = error.message;
    }
}

// Function to generate the graph
function generateGraph(team1Name, avgTeam1, team2Name, avgTeam2) {
    const graphContainer = document.getElementById('graphContainer');
    graphContainer.innerHTML = ''; // Clear previous graph

    const teams = [
        { name: team1Name, score: avgTeam1 },
        { name: team2Name, score: avgTeam2 }
    ];

    teams.forEach(team => {
        const bar = document.createElement('div');
        bar.style.width = '100px';
        bar.style.height = `${team.score * 10}px`;
        bar.style.backgroundColor = team.name === team1Name ? 'blue' : 'green';
        bar.style.margin = '5px';
        bar.style.textAlign = 'center';
        bar.style.color = 'white';
        bar.innerText = `${team.name}\n(${team.score.toFixed(1)})`;

        graphContainer.appendChild(bar);
    });
}
