"use strict";

// Main Game class that manages the game state and UI
class Game {
  constructor(players) {
    this.players = players;
    this.currentPlayerIndex = 0;
    this.gameContainer = document.getElementById("game");
    this.gameIsRunning = true;
    this.winningScore = 100;
    this.dice = new Dice();
    this.turnCount = 0;
    this.gameHistory = []; // Track game history
    this.botThinking = false; // Flag to prevent multiple bot turns

    this.initializeGame();
  }

  //#region Game Initialization

  // Initialize/reset the game state
  initializeGame() {
    // Reset all players
    this.players.forEach((player) => player.reset());

    this.turnCount = 0;
    this.gameIsRunning = true;
    this.botThinking = false;
    this.dice.reset();

    this.initialRender();
    this.updateGame();

    // Check if first player is a bot and automatically start their turn
    if (this.players[this.currentPlayerIndex].isBot && this.gameIsRunning) {
      console.log("Starting game with bot's turn");
      setTimeout(() => this.startBotTurn(), 800);
    }
  }
  //endregion

  //#region UI Rendering

  // Initial UI rendering
  initialRender() {
    this.renderPlayers();
    this.updateActivePlayer();
  }

  /**
   * Update game state and UI
   */
  updateGame() {
    this.renderPlayers();
    this.updateActivePlayer();
  }

  /**
   * Render all player cards in the UI
   */
  renderPlayers() {
    this.gameContainer.innerHTML = "";
    const gridContainer = document.createElement("div");
    gridContainer.classList.add("player-grid");

    // Configure grid layout based on player count
    if (this.players.length === 2) {
      gridContainer.style.gridTemplateColumns = "1fr 1fr";
      gridContainer.style.gridTemplateRows = "1fr";
    } else if (this.players.length === 3 || this.players.length === 4) {
      gridContainer.style.gridTemplateColumns = "1fr 1fr";
      gridContainer.style.gridTemplateRows = "1fr 1fr";
    }

    this.players.forEach((player, index) => {
      const playerCard = this.createPlayerCard(player, index);

      // Special case for 3 players: Last player spans two columns
      if (this.players.length === 3 && index === 2) {
        playerCard.style.gridColumn = "span 2";
      }

      gridContainer.appendChild(playerCard);
    });

    this.gameContainer.appendChild(gridContainer);
  }

  /**
   * Create a player card element
   */
  createPlayerCard(player, index) {
    const playerCard = document.createElement("div");
    playerCard.classList.add("player-card");

    if (this.players.length <= 2) {
      playerCard.style.height = "90vh";
    }

    playerCard.style.background = `linear-gradient(135deg, ${player.color} 0%, rgba(0, 0, 0, 0.8) 100%)`;
    playerCard.style.color = "white";
    playerCard.classList.toggle("active", index === this.currentPlayerIndex);

    // Player name
    const playerName = document.createElement("h3");
    playerName.textContent = player.name;
    playerCard.appendChild(playerName);

    // Player type
    const playerType = document.createElement("p");
    playerType.textContent = player.isBot
      ? `Bot - ${player.difficulty}`
      : "Human";
    playerCard.appendChild(playerType);

    // Player details section
    playerCard.appendChild(this.createPlayerDetails(player));

    // Button controls
    playerCard.appendChild(this.createPlayerButtons(player, index));

    return playerCard;
  }

  /**
   * Create player details section
   */
  createPlayerDetails(player) {
    const playerDetails = document.createElement("div");
    playerDetails.classList.add("player-details");

    const playerRoll = document.createElement("p");
    playerRoll.textContent = `Current Roll: ${player.currentRoll}`;
    playerDetails.appendChild(playerRoll);

    const playerTotal = document.createElement("p");
    playerTotal.textContent = `Total: ${player.total}`;
    playerDetails.appendChild(playerTotal);

    const playerWins = document.createElement("p");
    playerWins.textContent = `Wins: ${player.winCount}`;
    playerDetails.appendChild(playerWins);

    return playerDetails;
  }

  /**
   * Create player control buttons
   */
  createPlayerButtons(player, index) {
    const cardBtn = document.createElement("div");
    cardBtn.classList.add("card-button");

    const isCurrentPlayer = index === this.currentPlayerIndex;
    const buttonsDisabled =
      !isCurrentPlayer || player.isBot || !this.gameIsRunning;

    // Roll button
    const rollBtn = document.createElement("button");
    rollBtn.textContent = "Roll";
    rollBtn.id = "roll-button";
    rollBtn.addEventListener("click", () => this.rollDice());
    rollBtn.disabled = buttonsDisabled;
    cardBtn.appendChild(rollBtn);

    // Hold button
    const holdBtn = document.createElement("button");
    holdBtn.textContent = "Hold";
    holdBtn.id = "hold-button";
    holdBtn.addEventListener("click", () => this.holdTurn());
    holdBtn.disabled = buttonsDisabled;
    cardBtn.appendChild(holdBtn);

    // New Game button
    const newGameBtn = document.createElement("button");
    newGameBtn.textContent = "Game options";
    newGameBtn.id = "new-game-button";
    newGameBtn.addEventListener("click", function () {
      if (confirm("This will end the current game are you sure?")) {
        document.getElementById("explanation").style.display = "none";
        document.getElementById("game").style.display = "none";
        document.getElementById("settings").style.display = "flex";
        document.getElementById("dice-container").style.display = "none";
      }
    });
    cardBtn.appendChild(newGameBtn);

    // Stats button
    const statsBtn = document.createElement("button");
    statsBtn.textContent = "Stats";
    statsBtn.id = "stats-button";
    statsBtn.addEventListener("click", () => this.showPlayerStats(player));
    cardBtn.appendChild(statsBtn);

    return cardBtn;
  }

  /**
   * Update UI to highlight the active player
   */
  updateActivePlayer() {
    const playerCards = document.querySelectorAll(".player-card");
    playerCards.forEach((card, index) => {
      const isCurrentPlayer = index === this.currentPlayerIndex;

      card.classList.toggle("active", isCurrentPlayer);
      card.classList.toggle("greyed-out", !isCurrentPlayer);

      // Update button states for active/inactive players
      const rollBtn = card.querySelector("#roll-button");
      const holdBtn = card.querySelector("#hold-button");

      if (rollBtn && holdBtn) {
        const player = this.players[index];
        const buttonsDisabled =
          !isCurrentPlayer || player.isBot || !this.gameIsRunning;

        rollBtn.disabled = buttonsDisabled;
        holdBtn.disabled = buttonsDisabled;
      }
    });
  }
  //endregion

  //#region Game Logic
  /**
   * Roll the dice for the current player
   */
  rollDice() {
    if (!this.gameIsRunning) return;

    const player = this.players[this.currentPlayerIndex];
    const diceValue = this.dice.roll();
    console.log(`${player.name} rolled a ${diceValue}`);

    // Display dice roll animation or effect
    this.showDiceRoll(diceValue);

    // Use player method to process roll
    const canContinue = player.processRoll(diceValue);

    if (!canContinue) {
      setTimeout(() => this.nextPlayer(), 800); // Add delay to see the bust before next player
    }

    this.updateGame();
  }

  /**
   * Display the dice roll visually
   */
  showDiceRoll(value) {
    // Placeholder for dice roll animation
    console.log(`Rolled a ${value}`);
    // This could be enhanced with actual visual feedback
  }

  /**
   * Hold the current turn and add points to total
   */
  holdTurn() {
    if (!this.gameIsRunning) return;

    const player = this.players[this.currentPlayerIndex];
    console.log(`${player.name} holds with ${player.currentRoll}`);

    // Use player method to handle holding
    player.holdTurn();

    if (player.total >= this.winningScore) {
      this.endGame(player);
      return;
    }

    this.nextPlayer();
  }

  /**
   * Move to the next player
   */
  nextPlayer() {
    if (!this.gameIsRunning) return;

    const playerOrder = this.getPlayerArray();
    const currentIndex = playerOrder.indexOf(this.currentPlayerIndex);
    this.currentPlayerIndex =
      playerOrder[(currentIndex + 1) % playerOrder.length];
    this.turnCount++;

    console.log(`Next player: ${this.players[this.currentPlayerIndex].name}`);
    this.updateGame();

    // Auto-start bot turn if current player is a bot
    if (this.players[this.currentPlayerIndex].isBot && this.gameIsRunning) {
      setTimeout(() => this.startBotTurn(), 800);
    }
  }

  /**
   * Get player order array based on number of players
   */
  getPlayerArray() {
    switch (this.players.length) {
      case 2:
        return [0, 1];
      case 3:
        return [0, 1, 2];
      case 4:
        return [0, 1, 3, 2]; // Special ordering for 4 players
      default:
        console.log("Error in turn logic");
        return [0]; // Return first player as fallback
    }
  }
  //endregion

  //#region Bot Logic
  /**
   * Start a bot's turn safely
   */
  startBotTurn() {
    if (!this.gameIsRunning || this.botThinking) return;

    this.botThinking = true;
    this.botTurn();
  }

  /**
   * Handle bot's turn logic
   */
  botTurn() {
    if (!this.gameIsRunning) {
      this.botThinking = false;
      return;
    }

    const bot = this.players[this.currentPlayerIndex];
    if (!bot.isBot) {
      this.botThinking = false;
      return;
    }

    // Create gameState object to pass to bot for decision making
    const gameState = {
      players: this.players,
      currentPlayerIndex: this.currentPlayerIndex,
      winningScore: this.winningScore,
      turnCount: this.turnCount,
    };

    console.log(`Bot ${bot.name} is thinking...`);

    // Roll the dice first
    this.rollDice();

    // If rolled a 1, turn ends
    if (bot.currentRoll === 0) {
      console.log(`Bot ${bot.name} rolled a 1 and busted`);
      this.botThinking = false;
      return; // nextPlayer is already called in rollDice when rolling a 1
    }

    // Decide whether to roll again or hold
    setTimeout(() => {
      if (!this.gameIsRunning) {
        this.botThinking = false;
        return;
      }

      const shouldRollAgain = bot.shouldRoll(gameState);
      console.log(
        `Bot ${bot.name} decides to ${shouldRollAgain ? "roll again" : "hold"}`
      );

      if (shouldRollAgain) {
        // Roll again
        this.botTurn();
      } else {
        // Hold
        this.holdTurn();
        this.botThinking = false;
      }
    }, 1000);
  }
  //endregion

  //#region Game End & Storage
  /**
   * End the game when a player reaches the winning score
   */
  endGame(winner) {
    this.gameIsRunning = false;
    this.botThinking = false;

    // Record win for the winner
    winner.recordWin();

    // Store game history with detailed stats
    const gameStats = {
      name: winner.name,
      score: winner.total,
      turns: winner.turnHistory.length,
      date: new Date().toISOString(),
      turnHistory: winner.turnHistory,
      stats: winner.getStats(),
    };

    this.gameHistory.push(gameStats);

    console.log(
      `Game ended. Winner: ${winner.name} with score ${winner.total}`
    );
    alert(`${winner.name} wins with a score of ${winner.total}!`);

    // Save the winner and detailed stats to localStorage
    this.saveWinnerToLocalStorage(gameStats);

    setTimeout(() => {
      if (confirm("Play again?")) {
        this.initializeGame();
      } else {
        // Redirect to leaderboard.html if they don't want to play again
        window.location.href = "leaderboard.html";
      }
    }, 1500);
  }

  /**
   * Save winner data to localStorage
   */
  saveWinnerToLocalStorage(gameStats) {
    try {
      // Retrieve the existing winners from localStorage
      const winnersData = localStorage.getItem("winners");

      // Check if the data is null or empty
      let winners = [];
      if (winnersData) {
        winners = JSON.parse(winnersData);
      }

      // Add the new winner and detailed stats to the list
      winners.push(gameStats);

      // Save the updated list back to localStorage
      localStorage.setItem("winners", JSON.stringify(winners));
    } catch (error) {
      console.error("Error saving winner to localStorage:", error);
      // If there's an error, initialize a new array and save the winner
      localStorage.setItem("winners", JSON.stringify([gameStats]));
    }
  }
  //endregion

  //#region Stats Modal
  /**
   * Show player statistics in a modal
   */
  showPlayerStats(player) {
    const stats = player.getStats();
    const playerIndex = this.players.indexOf(player);

    // Create modal elements
    const modal = this.createStatsModal(player, stats, playerIndex);

    // Add to the document
    document.body.appendChild(modal);

    // Add keyboard navigation
    this.setupStatsModalKeyboardNav(modal, playerIndex);
  }

  /**
   * Create the stats modal UI
   */
  createStatsModal(player, stats, playerIndex) {
    // Create the modal overlay
    const modal = document.createElement("div");
    modal.classList.add("stats-modal");

    // Create the stats container
    const container = document.createElement("div");
    container.classList.add("stats-container");
    container.style.borderTop = `5px solid ${player.color}`;

    // Add header
    const header = this.createStatsModalHeader(player);

    // Add content
    const content = this.createStatsModalContent(player, stats);

    // Add footer with navigation
    const footer = this.createStatsModalFooter(playerIndex);

    // Assemble all the components
    container.appendChild(header);
    container.appendChild(content);
    container.appendChild(footer);
    modal.appendChild(container);

    // Set up event listeners for closing
    this.setupStatsModalCloseEvents(modal);

    return modal;
  }

  /**
   * Create the header section of the stats modal
   */
  createStatsModalHeader(player) {
    const header = document.createElement("div");
    header.classList.add("stats-header");
    header.style.background = `linear-gradient(to right, ${player.color}, #2c3e50)`;

    const title = document.createElement("h3");
    title.textContent = `${player.name} Statistics`;

    const closeBtn = document.createElement("button");
    closeBtn.innerHTML = "×";
    closeBtn.setAttribute("aria-label", "Close");

    header.appendChild(title);
    header.appendChild(closeBtn);

    return header;
  }

  /**
   * Create the content section of the stats modal
   */
  createStatsModalContent(player, stats) {
    const content = document.createElement("div");
    content.classList.add("stats-content");

    // Add basic stats rows
    this.addStatsRows(content, stats);

    // Add bust rate visualization if available
    if (stats.totalTurns > 0) {
      this.addBustRateChart(content, stats, player);

      // Add turn history if available
      if (player.turnHistory && player.turnHistory.length > 0) {
        this.addTurnHistoryTable(content, player);
      }
    }

    return content;
  }

  /**
   * Add stats row items to the content container
   */
  addStatsRows(content, stats) {
    const statsData = [
      { label: "Wins", value: stats.winCount },
      { label: "Current Score", value: stats.total },
      { label: "Total Turns", value: stats.totalTurns },
      { label: "Bust Rate", value: stats.bustRate },
      { label: "Avg. Score Per Turn", value: stats.avgScorePerTurn },
    ];

    statsData.forEach((item) => {
      const row = document.createElement("div");
      row.classList.add("stats-row");

      const label = document.createElement("div");
      label.classList.add("stats-label");
      label.textContent = item.label;

      const value = document.createElement("div");
      value.classList.add("stats-value");
      value.textContent = item.value;

      row.appendChild(label);
      row.appendChild(value);
      content.appendChild(row);
    });
  }

  /**
   * Add bust rate chart to the stats content
   */
  addBustRateChart(content, stats, player) {
    const chartSection = document.createElement("div");
    chartSection.classList.add("stats-chart");

    const chartTitle = document.createElement("div");
    chartTitle.classList.add("stats-chart-title");
    chartTitle.textContent = "Bust Rate";

    const chartContainer = document.createElement("div");
    chartContainer.classList.add("stats-bar-container");

    const bustPercent = parseFloat(stats.bustRate);

    const chartBar = document.createElement("div");
    chartBar.classList.add("stats-bar");
    chartBar.style.width = `${bustPercent}%`;
    chartBar.style.backgroundColor = player.color;

    const chartLabel = document.createElement("div");
    chartLabel.classList.add("stats-bar-label");
    chartLabel.textContent = stats.bustRate;

    chartContainer.appendChild(chartBar);
    chartContainer.appendChild(chartLabel);

    chartSection.appendChild(chartTitle);
    chartSection.appendChild(chartContainer);
    content.appendChild(chartSection);
  }

  /**
   * Add turn history table to the stats content
   */
  addTurnHistoryTable(content, player) {
    const recentTurns = player.turnHistory.slice(-5); // Last 5 turns

    const historyTitle = document.createElement("div");
    historyTitle.classList.add("stats-chart-title");
    historyTitle.textContent = "Recent Turns";
    content.appendChild(historyTitle);

    const table = document.createElement("table");
    table.classList.add("turn-history-table");

    // Add header
    const thead = document.createElement("thead");
    const headerRow = document.createElement("tr");

    ["Turn", "Roll Total", "Result"].forEach((text) => {
      const th = document.createElement("th");
      th.textContent = text;
      headerRow.appendChild(th);
    });

    thead.appendChild(headerRow);
    table.appendChild(thead);

    // Add body
    const tbody = document.createElement("tbody");

    recentTurns.forEach((turn, index) => {
      const row = document.createElement("tr");

      // Turn number cell
      const turnCell = document.createElement("td");
      turnCell.textContent =
        player.turnHistory.length - recentTurns.length + index + 1;
      row.appendChild(turnCell);

      // Roll total cell
      const rollCell = document.createElement("td");
      rollCell.textContent = turn.rollTotal || 0;
      row.appendChild(rollCell);

      // Result cell
      const resultCell = document.createElement("td");
      if (turn.busted) {
        resultCell.textContent = "Busted!";
        resultCell.classList.add("busted");
      } else {
        resultCell.textContent = `+${turn.rollTotal} → ${turn.newTotal}`;
      }
      row.appendChild(resultCell);

      tbody.appendChild(row);
    });

    table.appendChild(tbody);
    content.appendChild(table);
  }

  /**
   * Create the footer section of the stats modal with navigation
   */
  createStatsModalFooter(playerIndex) {
    const footer = document.createElement("div");
    footer.classList.add("stats-footer");

    // Add navigation container
    const navContainer = document.createElement("div");
    navContainer.classList.add("stats-navigation");

    // Previous player button
    const prevBtn = document.createElement("button");
    prevBtn.classList.add("nav-button", "prev-button");
    prevBtn.innerHTML = "&#8592; Previous";
    prevBtn.addEventListener("click", () => {
      const prevIndex =
        (playerIndex - 1 + this.players.length) % this.players.length;
      const modal = document.querySelector(".stats-modal");
      if (modal) {
        document.body.removeChild(modal);
        this.showPlayerStats(this.players[prevIndex]);
      }
    });

    // Next player button
    const nextBtn = document.createElement("button");
    nextBtn.classList.add("nav-button", "next-button");
    nextBtn.innerHTML = "Next &#8594;";
    nextBtn.addEventListener("click", () => {
      const nextIndex = (playerIndex + 1) % this.players.length;
      const modal = document.querySelector(".stats-modal");
      if (modal) {
        document.body.removeChild(modal);
        this.showPlayerStats(this.players[nextIndex]);
      }
    });

    navContainer.appendChild(prevBtn);

    // Current position indicator
    const positionIndicator = document.createElement("div");
    positionIndicator.classList.add("position-indicator");
    positionIndicator.textContent = `${playerIndex + 1} of ${
      this.players.length
    }`;
    navContainer.appendChild(positionIndicator);

    navContainer.appendChild(nextBtn);

    // Close button
    const footerBtn = document.createElement("button");
    footerBtn.classList.add("stats-close-button");
    footerBtn.textContent = "Close";

    footer.appendChild(navContainer);
    footer.appendChild(footerBtn);

    return footer;
  }

  /**
   * Set up event listeners for closing the modal
   */
  setupStatsModalCloseEvents(modal) {
    const closeBtn = modal.querySelector(".stats-header button");
    const footerBtn = modal.querySelector(".stats-close-button");

    // Close button in header
    closeBtn.addEventListener("click", () => {
      document.body.removeChild(modal);
    });

    // Close button in footer
    footerBtn.addEventListener("click", () => {
      document.body.removeChild(modal);
    });

    // Close when clicking outside the container
    modal.addEventListener("click", (e) => {
      if (e.target === modal) {
        document.body.removeChild(modal);
      }
    });
  }

  /**
   * Set up keyboard navigation for the stats modal
   */
  setupStatsModalKeyboardNav(modal, playerIndex) {
    const prevBtn = modal.querySelector(".prev-button");
    const nextBtn = modal.querySelector(".next-button");

    const handleKeyDown = (e) => {
      if (e.key === "ArrowLeft") {
        prevBtn.click();
      } else if (e.key === "ArrowRight") {
        nextBtn.click();
      } else if (e.key === "Escape") {
        if (document.body.contains(modal)) {
          document.body.removeChild(modal);
          document.removeEventListener("keydown", handleKeyDown);
        }
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    // Clean up event listener when modal is closed
    const cleanupListener = () => {
      document.removeEventListener("keydown", handleKeyDown);
    };

    const closeBtn = modal.querySelector(".stats-header button");
    const footerBtn = modal.querySelector(".stats-close-button");
    closeBtn.addEventListener("click", cleanupListener);
    footerBtn.addEventListener("click", cleanupListener);
  }
  //endregion
}

//#region Player Loading
/**
 * Load players from localStorage or use defaults
 */
function loadPlayersFromStorage() {
  try {
    const savedSettings = JSON.parse(localStorage.getItem("gameSettings"));
    if (!savedSettings || !savedSettings.players) {
      // Default players if none are saved
      return [
        new Player("Player 1", "#3498db"),
        new Bot("Easy Bot", "#e74c3c", "Easy"),
        new Bot("Medium Bot", "#2ecc71", "Medium"),
        new Bot("Hard Bot", "#f39c12", "Hard"),
      ];
    }

    return savedSettings.players.map((player) =>
      player.isBot
        ? new Bot(player.name, player.color, player.botDifficulty)
        : new Player(player.name, player.color)
    );
  } catch (error) {
    console.error("Error loading player settings:", error);
    // Return default players if there was an error
    return [
      new Player("Default Player", "#3498db"),
      new Bot("Default Bot", "#e74c3c", "Easy"),
    ];
  }
}

/**
 * Function to initialize the game
 */
function startGame() {
  const players = loadPlayersFromStorage();
  const game = new Game(players);

  // Add global console logger for debugging
  console.log(
    "Game initialized with players:",
    players.map((p) => `${p.name} (${p.isBot ? "Bot" : "Human"})`)
  );
}
//endregion
