"use strict";

//#region Bot Definition
class Bot extends Player {
  constructor(name, color, difficulty = "Medium", customSettings = {}) {
    super(name, color, true);
    this.difficulty = difficulty;
    this.customSettings = customSettings;
    this.setDifficultyParameters();
  }

  //#region Difficulty Settings
  setDifficultyParameters() {
    const defaultSettings = {
      Easy: { fixedRolls: 5, targetScore: 15 },
      Medium: {
        targetScore: 20,
        riskTolerance: 0.7,
        useOpponentTracking: true,
      },
      Hard: {
        targetScore: 25,
        riskTolerance: 0.8,
        useOpponentTracking: true,
        useEndgameStrategy: true,
        trackRecentRolls: true,
      },
      Expert: {
        targetScore: 30,
        riskTolerance: 0.85,
        useOpponentTracking: true,
        useEndgameStrategy: true,
        trackRecentRolls: true,
        useAdaptiveStrategy: true,
        useAdvancedMomentum: true,
      },
    };

    const settings = this.customSettings.enabled
      ? this.customSettings
      : defaultSettings[this.difficulty] || defaultSettings.Medium;

    Object.assign(this, settings);

    this.rollCount = 0;
    this.currentTurnRolls = [];
    this.recentScores = [];
    this.consecutiveBusts = 0;
  }

  //#region Decision Logic
  /**
   * Determines if the bot should roll again or hold
   * @param {Object} gameState - Current game state
   * @returns {boolean} - True if the bot should roll again, false to hold
   */
  shouldRoll(gameState) {
    if (this.total + this.currentRoll >= gameState.winningScore) return false;
    if (this.difficulty === "Easy") {
      return (
        this.rollCount < this.fixedRolls && this.currentRoll < this.targetScore
      );
    }

    const remainingToWin =
      gameState.winningScore - (this.total + this.currentRoll);
    let riskFactor = this.riskTolerance;
    let targetScore = this.targetScore;

    if (this.useOpponentTracking) {
      const opponents = gameState.players.filter((p) => p !== this);
      const highestOpponent = Math.max(...opponents.map((p) => p.total));
      const opponentGap = highestOpponent - this.total;

      if (opponentGap > 30) {
        riskFactor += 0.15;
        targetScore += 5;
      } else if (this.total > highestOpponent + 20) {
        riskFactor -= 0.1;
        targetScore -= 3;
      }
    }

    if (this.useEndgameStrategy && remainingToWin < 50) {
      riskFactor += (1 - remainingToWin / 50) * 0.2;
    }

    if (this.trackRecentRolls) {
      if (this.consecutiveBusts >= 2) {
        riskFactor -= 0.1 * this.consecutiveBusts;
        targetScore = Math.max(15, targetScore - 3);
      }
      if (this.currentRoll > 20) {
        riskFactor -= this.currentRoll / 100;
      }
    }

    if (this.useAdaptiveStrategy) {
      if (remainingToWin < 30) {
        targetScore = Math.min(remainingToWin, targetScore);
      }

      if (this.recentScores.length >= 3) {
        const avgScore =
          this.recentScores.reduce((sum, s) => sum + s, 0) /
          this.recentScores.length;
        if (avgScore < 15) {
          riskFactor += 0.1;
          targetScore += 5;
        } else if (avgScore > 25) {
          riskFactor -= 0.05;
        }
      }
    }

    if (this.useAdvancedMomentum && this.currentTurnRolls.length > 0) {
      const avgRoll =
        this.currentTurnRolls.reduce((sum, r) => sum + r, 0) /
        this.currentTurnRolls.length;
      const highRolls = this.currentTurnRolls.filter((r) => r >= 5).length;

      if (avgRoll > 4 || highRolls >= 2) riskFactor += 0.1;
      else if (avgRoll < 3) riskFactor -= 0.1;
    }

    riskFactor = Math.max(0.3, Math.min(0.95, riskFactor));
    return this.currentRoll < targetScore && Math.random() < riskFactor;
  }

  //#region Roll + Hold
  /**
   * Processes a dice roll
   * @param {number} diceValue - Value of the dice roll
   * @returns {*} - Result from super.processRoll
   */
  processRoll(diceValue) {
    this.rollCount++;

    if (this.trackRecentRolls || this.useAdvancedMomentum) {
      if (diceValue === 1) {
        this.consecutiveBusts++;
        this.currentTurnRolls = [];
      } else {
        this.currentTurnRolls.push(diceValue);
      }
    }

    return super.processRoll(diceValue);
  }

  /**
   * Holds the current turn
   * @returns {*} - Result from super.holdTurn
   */
  holdTurn() {
    this.rollCount = 0;

    if (this.trackRecentRolls || this.useAdaptiveStrategy) {
      if (this.currentRoll > 0) {
        this.recentScores.push(this.currentRoll);
        if (this.recentScores.length > 5) {
          this.recentScores.shift();
        }
        this.consecutiveBusts = 0;
      }
      this.currentTurnRolls = [];
    }

    return super.holdTurn();
  }

  //#region Reset Function
  /**
   * Resets the bot for a new game
   */
  reset() {
    this.rollCount = 0;
    this.currentTurnRolls = [];
    this.recentScores = [];
    this.consecutiveBusts = 0;
    super.reset();
    this.setDifficultyParameters();
  }
}
