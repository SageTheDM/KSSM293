"use strict";

//#region Event Listeners
document.addEventListener("DOMContentLoaded", () => {
  const numPlayersValue = document.getElementById("num-players-value");
  const playerSettingsDiv = document.getElementById("player-settings");
  const increasePlayersBtn = document.getElementById("increase-players");
  const decreasePlayersBtn = document.getElementById("decrease-players");
  const uploadSettingsBtn = document.getElementById("upload-settings");
  //#endregion Event Listeners

  //#region Player Settings
  function renderPlayerSettings(numPlayers) {
    playerSettingsDiv.innerHTML = "";
    const settings = JSON.parse(localStorage.getItem("gameSettings"));
    const savedPlayers = settings ? settings.players : [];

    for (let i = 0; i < numPlayers; i++) {
      const playerDiv = document.createElement("div");
      playerDiv.classList.add("player-settings");

      playerDiv.innerHTML = `
          <label for="player-name-${i}">Player ${i + 1} Name:</label>
          <input type="text" id="player-name-${i}" required>
          <label for="player-color-${i}">Color:</label>
          <input type="color" id="player-color-${i}" value="#ffffff">
          <label for="is-bot-${i}">Is Bot:</label>
          <input type="checkbox" id="is-bot-${i}">
          <label for="bot-difficulty-${i}" class="bot-difficulty-label" style="display: none;">Bot Difficulty:</label>
          <select id="bot-difficulty-${i}" style="display: none;">
            <option value="easy">Easy</option>
            <option value="medium">Medium</option>
            <option value="hard">Hard</option>
            <option value="expert">Expert</option>
            <option value="custom">Custom</option>
          </select>
          <div id="custom-bot-settings-${i}" class="custom-bot-settings" style="display: none;">
            <label for="risk-tolerance-${i}">Risk Tolerance:</label>
            <input type="number" id="risk-tolerance-${i}" min="0" max="1" step="0.01" value="0.5">
            <label for="target-score-${i}">Target Score:</label>
            <input type="number" id="target-score-${i}" min="5" max="50" step="1" value="20">
            <label for="adaptive-threshold-${i}">Adaptive Threshold:</label>
            <input type="number" id="adaptive-threshold-${i}" min="50" max="100" step="1" value="75">
          </div>
        `;

      const nameInput = playerDiv.querySelector(`#player-name-${i}`);
      const colorInput = playerDiv.querySelector(`#player-color-${i}`);
      const isBotCheckbox = playerDiv.querySelector(`#is-bot-${i}`);
      const botDifficultySelect = playerDiv.querySelector(
        `#bot-difficulty-${i}`
      );
      const botDifficultyLabel = playerDiv.querySelector(
        `.bot-difficulty-label`
      );
      const customBotSettingsDiv = playerDiv.querySelector(
        `#custom-bot-settings-${i}`
      );
      const riskToleranceInput = playerDiv.querySelector(
        `#risk-tolerance-${i}`
      );
      const targetScoreInput = playerDiv.querySelector(`#target-score-${i}`);
      const adaptiveThresholdInput = playerDiv.querySelector(
        `#adaptive-threshold-${i}`
      );

      if (savedPlayers[i]) {
        nameInput.value = savedPlayers[i].name;
        colorInput.value = savedPlayers[i].color;
        isBotCheckbox.checked = savedPlayers[i].isBot;
        if (savedPlayers[i].isBot) {
          botDifficultySelect.value = savedPlayers[i].botDifficulty;
          botDifficultySelect.style.display = "block";
          botDifficultyLabel.style.display = "block";
          if (savedPlayers[i].botDifficulty === "custom") {
            customBotSettingsDiv.style.display = "block";
            riskToleranceInput.value =
              savedPlayers[i].customSettings.riskTolerance;
            targetScoreInput.value = savedPlayers[i].customSettings.targetScore;
            adaptiveThresholdInput.value =
              savedPlayers[i].customSettings.adaptiveThreshold;
          }
        }
      }

      isBotCheckbox.addEventListener("change", () => {
        botDifficultySelect.style.display = isBotCheckbox.checked
          ? "block"
          : "none";
        botDifficultyLabel.style.display = isBotCheckbox.checked
          ? "block"
          : "none";
        customBotSettingsDiv.style.display = "none";
        saveSettings();
        updateGame();
      });

      botDifficultySelect.addEventListener("change", () => {
        customBotSettingsDiv.style.display =
          botDifficultySelect.value === "custom" ? "block" : "none";
        saveSettings();
        updateGame();
      });

      [
        nameInput,
        colorInput,
        riskToleranceInput,
        targetScoreInput,
        adaptiveThresholdInput,
      ].forEach((input) =>
        input.addEventListener("input", () => {
          saveSettings();
          updateGame();
        })
      );

      playerSettingsDiv.appendChild(playerDiv);
    }
  }
  //#endregion Player Settings

  //#region Settings Management
  function saveSettings() {
    const players = [];
    const numPlayers = parseInt(numPlayersValue.textContent, 10);

    for (let i = 0; i < numPlayers; i++) {
      const isBot = document.getElementById(`is-bot-${i}`).checked;
      players.push({
        name: document.getElementById(`player-name-${i}`).value,
        color: document.getElementById(`player-color-${i}`).value,
        isBot,
        botDifficulty: isBot
          ? document.getElementById(`bot-difficulty-${i}`).value
          : null,
        customSettings:
          isBot &&
          document.getElementById(`bot-difficulty-${i}`).value === "custom"
            ? {
                riskTolerance: parseFloat(
                  document.getElementById(`risk-tolerance-${i}`).value
                ),
                targetScore: parseInt(
                  document.getElementById(`target-score-${i}`).value,
                  10
                ),
                adaptiveThreshold: parseInt(
                  document.getElementById(`adaptive-threshold-${i}`).value,
                  10
                ),
              }
            : null,
      });
    }

    localStorage.setItem(
      "gameSettings",
      JSON.stringify({ numPlayers, players })
    );
    updateGame();
  }
  //#endregion Settings Management

  //#region Player Count
  increasePlayersBtn.addEventListener("click", () => {
    let numPlayers = parseInt(numPlayersValue.textContent, 10);
    if (numPlayers < 4) {
      numPlayers++;
      numPlayersValue.textContent = numPlayers;
      renderPlayerSettings(numPlayers);
      saveSettings();
    }
  });

  decreasePlayersBtn.addEventListener("click", () => {
    let numPlayers = parseInt(numPlayersValue.textContent, 10);
    if (numPlayers > 2) {
      numPlayers--;
      numPlayersValue.textContent = numPlayers;
      renderPlayerSettings(numPlayers);
      saveSettings();
    }
  });
  //#endregion Player Count

  //#region File Upload
  // Add event listener for the upload settings button
  uploadSettingsBtn.addEventListener("click", () => {
    // Create a hidden file input element
    const fileInput = document.createElement("input");
    fileInput.type = "file";
    fileInput.accept = ".json";
    fileInput.style.display = "none";
    document.body.appendChild(fileInput);

    // Trigger the file input click
    fileInput.click();

    // Handle file selection
    fileInput.addEventListener("change", (event) => {
      const file = event.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
          try {
            const uploadedSettings = JSON.parse(e.target.result);

            // Validate the uploaded settings
            if (
              uploadedSettings &&
              uploadedSettings.numPlayers &&
              uploadedSettings.players &&
              Array.isArray(uploadedSettings.players)
            ) {
              // Ensure numPlayers is within valid range (2-4)
              const numPlayers = Math.min(
                Math.max(parseInt(uploadedSettings.numPlayers), 2),
                4
              );

              // Update the UI with the uploaded settings
              numPlayersValue.textContent = numPlayers;

              // Save to localStorage
              localStorage.setItem(
                "gameSettings",
                JSON.stringify({
                  numPlayers: numPlayers,
                  players: uploadedSettings.players.slice(0, numPlayers),
                })
              );

              // Render the player settings
              renderPlayerSettings(numPlayers);

              alert("Settings loaded successfully!");
            } else {
              alert("Invalid settings file format.");
            }
          } catch (error) {
            alert("Error parsing settings file: " + error.message);
          }
        };
        reader.readAsText(file);
      }

      // Remove the file input element
      document.body.removeChild(fileInput);
    });
  });
  //#endregion File Upload

  //#region Settings Load
  function loadSettings() {
    const settings = JSON.parse(localStorage.getItem("gameSettings")) || {
      numPlayers: 2,
    };
    numPlayersValue.textContent = settings.numPlayers;
    renderPlayerSettings(settings.numPlayers);
  }

  loadSettings();
});
