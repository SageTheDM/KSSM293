"use strict";

class Dice {
  constructor() {
    this.value = 1;
    this.diceElement = document.getElementById("dice");
    this.history = []; // Track roll history
    this.renderDots();
  }

  //#region Roll the dice
  roll() {
    this.value = Math.floor(Math.random() * 6) + 1;
    this.history.push(this.value);
    if (this.diceElement) {
      this.diceElement.setAttribute("data-value", this.value);
      this.playAnimation();
      this.renderDots();
    }
    return this.value;
  }

  //#region Dice animation
  playAnimation() {
    this.diceElement.classList.add("rolling");
    setTimeout(() => {
      this.diceElement.classList.remove("rolling");
    }, 700);
  }

  //#region Render dice dots
  renderDots() {
    if (!this.diceElement) return;
    const dotPatterns = {
      1: [[50, 50]],
      2: [
        [20, 20],
        [80, 80],
      ],
      3: [
        [20, 20],
        [50, 50],
        [80, 80],
      ],
      4: [
        [20, 20],
        [80, 20],
        [20, 80],
        [80, 80],
      ],
      5: [
        [20, 20],
        [80, 20],
        [50, 50],
        [20, 80],
        [80, 80],
      ],
      6: [
        [20, 20],
        [80, 20],
        [20, 50],
        [80, 50],
        [20, 80],
        [80, 80],
      ],
    };
    this.diceElement.innerHTML = "";
    dotPatterns[this.value].forEach(([x, y]) => {
      const dot = document.createElement("div");
      dot.classList.add("dot");
      dot.style.left = `${x}%`;
      dot.style.top = `${y}%`;
      this.diceElement.appendChild(dot);
    });
  }

  //#region  statistics
  getStats() {
    if (this.history.length === 0) return {};
    const counts = [0, 0, 0, 0, 0, 0, 0]; // Index 0 is unused
    this.history.forEach((value) => counts[value]++);
    const percentages = counts.map((count) =>
      this.history.length > 0
        ? ((count / this.history.length) * 100).toFixed(1) + "%"
        : "0%"
    );
    return {
      totalRolls: this.history.length,
      counts: counts.slice(1), // Remove unused index 0
      percentages: percentages.slice(1), // Remove unused index 0
      average: (
        this.history.reduce((sum, val) => sum + val, 0) / this.history.length
      ).toFixed(2),
    };
  }

  //#region Reset roll
  reset() {
    this.history = [];
    this.value = 1;
    if (this.diceElement) {
      this.diceElement.setAttribute("data-value", this.value);
      this.renderDots();
    }
  }
}
