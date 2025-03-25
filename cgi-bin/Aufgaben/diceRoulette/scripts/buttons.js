"use strict";

//#region DOM Elements
const startButtonFormExp = document.getElementById("start-explanation");
const startButtonFormSet = document.getElementById("start-new-game");
const saveSettingsBtn = document.getElementById("save-settings");
const endGameBtn = document.getElementById("end-game");

//#region Event Listeners
startButtonFormExp.addEventListener("click", function () {
  document.getElementById("explanation").style.display = "none";
  document.getElementById("game").style.display = "none";
  document.getElementById("settings").style.display = "flex";
  document.getElementById("dice-container").style.display = "none";
});

startButtonFormSet.addEventListener("click", function () {
  document.getElementById("explanation").style.display = "none";
  document.getElementById("game").style.display = "grid";
  document.getElementById("settings").style.display = "none";
  document.getElementById("dice-container").style.display = "flex";
  startGame();
});

//#region Save Settings
saveSettingsBtn.addEventListener("click", function () {
  const settings = {
    numPlayers: document.getElementById("num-players-value").textContent,
    players: [],
  };

  for (let i = 0; i < settings.numPlayers; i++) {
    const playerName = document.getElementById(`player-name-${i}`).value;
    const playerColor = document.getElementById(`player-color-${i}`).value;
    const isBot = document.getElementById(`is-bot-${i}`).checked;
    const botDifficulty = document.getElementById(`bot-difficulty-${i}`).value;

    let customSettings = null;
    if (botDifficulty === "custom") {
      customSettings = {
        riskTolerance: document.getElementById(`risk-tolerance-${i}`).value,
        targetScore: document.getElementById(`target-score-${i}`).value,
        adaptiveThreshold: document.getElementById(`adaptive-threshold-${i}`)
          .value,
      };
    }

    settings.players.push({
      name: playerName,
      color: playerColor,
      isBot,
      botDifficulty,
      customSettings,
    });
  }

  // Save settings to localStorage
  localStorage.setItem("gameSettings", JSON.stringify(settings));

  // Download settings as JSON
  downloadJSON(settings, "game-settings.json");
});

//#region End Game
endGameBtn.addEventListener("click", function () {
  if (confirm("Are you sure you want to leave the Game?")) {
    window.location.reload();
  }
});

//#region Utility Functions
// Function to download JSON file
function downloadJSON(data, filename) {
  const blob = new Blob([JSON.stringify(data, null, 2)], {
    type: "application/json",
  });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
