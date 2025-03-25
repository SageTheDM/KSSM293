class Player {
  //#region Constructor
  constructor(name, color, isBot = false) {
    this.name = name;
    this.color = color;
    this.isBot = isBot;
    this.currentRoll = 0;
    this.total = 0;
    this.winCount = 0; // Track number of wins
    this.turnHistory = []; // Track roll history for analytics
  }

  //#region Reset
  reset() {
    this.currentRoll = 0;
    this.total = 0;
    this.turnHistory = [];
  }

  //#region Add roll
  holdTurn() {
    this.total += this.currentRoll;
    this.turnHistory.push({
      rollTotal: this.currentRoll,
      newTotal: this.total,
    });
    this.currentRoll = 0;
    return this.total;
  }

  //#region dice roll
  processRoll(diceValue) {
    if (diceValue === 1) {
      // Bust - lose current roll
      this.turnHistory.push({
        rollTotal: this.currentRoll,
        busted: true,
      });
      this.currentRoll = 0;
      return false; // Indicates turn should end
    } else {
      // Add to current roll
      this.currentRoll += diceValue;
      return true; // Indicates turn can continue
    }
  }

  //#region Record a win
  recordWin() {
    this.winCount++;
  }

  //#region Player stats
  getStats() {
    const totalTurns = this.turnHistory.length;
    const bustCount = this.turnHistory.filter((turn) => turn.busted).length;
    const avgScore =
      totalTurns > 0
        ? this.turnHistory.reduce(
            (sum, turn) => sum + (turn.rollTotal || 0),
            0
          ) / totalTurns
        : 0;
    return {
      name: this.name,
      total: this.total,
      winCount: this.winCount,
      totalTurns,
      bustRate:
        totalTurns > 0
          ? ((bustCount / totalTurns) * 100).toFixed(1) + "%"
          : "0%",
      avgScorePerTurn: avgScore.toFixed(1),
    };
  }
}
