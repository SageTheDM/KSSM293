"use strict";

//#region event-listeners
// Add event listener for downloading leaderboard
document
  .getElementById("download-leaderboard")
  .addEventListener("click", downloadLeaderboard);

document
  .getElementById("upload-leaderboard")
  .addEventListener("click", uploadLeaderboard);
//# endregion event-listeners

//#region leaderboard-loading
// Function to load and display the leaderboard
function loadLeaderboard() {
  // Retrieve the winners from localStorage
  const winners = JSON.parse(localStorage.getItem("winners")) || [];
  console.log("Winners from localStorage:", winners); // Debugging

  // Calculate Score/Turns ratio for each winner
  winners.forEach((winner) => {
    winner.efficiency = winner.score / winner.turns;

    // Calculate additional stats if not already present
    if (
      !winner.avgScorePerTurn &&
      winner.turnHistory &&
      winner.turnHistory.length > 0
    ) {
      const totalScore = winner.turnHistory.reduce(
        (sum, turn) => sum + (turn.rollTotal || 0),
        0
      );
      winner.avgScorePerTurn = totalScore / winner.turnHistory.length;
    }

    if (
      !winner.bustRate &&
      winner.turnHistory &&
      winner.turnHistory.length > 0
    ) {
      const bustCount = winner.turnHistory.filter((turn) => turn.busted).length;
      winner.bustRate = (bustCount / winner.turnHistory.length) * 100;
    }
  });

  // Sort winners by efficiency (descending order) by default
  winners.sort((a, b) => b.efficiency - a.efficiency);

  // Render the leaderboard
  renderLeaderboard(winners);

  //#region filter-listener
  // Add event listener for the filter button
  document.getElementById("apply-filter").addEventListener("click", () => {
    const filter = document.getElementById("filter").value;
    let sortedWinners = [...winners]; // Create a copy to avoid mutation issues

    switch (filter) {
      case "score":
        sortedWinners.sort((a, b) => b.score - a.score);
        break;
      case "turns":
        sortedWinners.sort((a, b) => a.turns - b.turns);
        break;
      case "efficiency":
        sortedWinners.sort((a, b) => b.efficiency - a.efficiency);
        break;
      case "date":
        sortedWinners.sort((a, b) => new Date(b.date) - new Date(a.date));
        break;
      case "bustRate":
        sortedWinners.sort((a, b) => a.bustRate - b.bustRate);
        break;
      case "avgScorePerTurn":
        sortedWinners.sort((a, b) => b.avgScorePerTurn - a.avgScorePerTurn);
        break;
      default:
      // No sorting needed
    }

    renderLeaderboard(sortedWinners);
  });
  //# endregion filter-listener

  //#region modal-listeners
  // Add event listener for the modal close button
  document.querySelector(".close").addEventListener("click", () => {
    document.getElementById("stats-modal").style.display = "none";
  });

  // Close modal when clicking outside of it
  window.addEventListener("click", (event) => {
    const modal = document.getElementById("stats-modal");
    if (event.target === modal) {
      modal.style.display = "none";
    }
  });
  //# endregion modal-listeners
}
//# endregion leaderboard-loading

//#region render-leaderboard
// Function to render the leaderboard table
function renderLeaderboard(winners) {
  const tableBody = document.querySelector("#leaderboard-table tbody");
  if (!tableBody) {
    console.error("Table body not found!"); // Debugging
    return;
  }
  tableBody.innerHTML = "";

  // Calculate performance tiers based on efficiency
  const efficiencies = winners.map((winner) => winner.efficiency);
  const maxEfficiency = Math.max(...efficiencies, 1); // Prevent division by zero
  const minEfficiency = Math.min(...efficiencies, 0);
  const midEfficiency = minEfficiency + (maxEfficiency - minEfficiency) / 2;

  winners.forEach((winner, index) => {
    const row = document.createElement("tr");

    // Assign class based on efficiency performance
    if (
      winner.efficiency >=
      midEfficiency + (maxEfficiency - midEfficiency) / 2
    ) {
      row.classList.add("top-player");
    } else if (winner.efficiency >= midEfficiency) {
      row.classList.add("average-player");
    } else {
      row.classList.add("lower-player");
    }

    // Rank
    const rankCell = document.createElement("td");
    rankCell.textContent = index + 1;
    row.appendChild(rankCell);

    // Name (clickable to show detailed stats)
    const nameCell = document.createElement("td");
    nameCell.textContent = winner.name;
    nameCell.style.cursor = "pointer";
    nameCell.style.color = "white"; // Text color for better contrast
    nameCell.addEventListener("click", () =>
      showDetailedStats(winner, winners)
    );
    row.appendChild(nameCell);

    // Score
    const scoreCell = document.createElement("td");
    scoreCell.textContent = winner.score;
    row.appendChild(scoreCell);

    // Turns
    const turnsCell = document.createElement("td");
    turnsCell.textContent = winner.turns;
    row.appendChild(turnsCell);

    // Efficiency (Score/Turns)
    const efficiencyCell = document.createElement("td");
    efficiencyCell.textContent = winner.efficiency.toFixed(2);
    row.appendChild(efficiencyCell);

    // Check for additional columns in the header
    const headerRow = document.querySelector("#leaderboard-table thead tr");
    const columnCount = headerRow.querySelectorAll("th").length;

    // Get all header cells
    const headerCells = Array.from(headerRow.querySelectorAll("th"));

    // Check for Bust Rate column
    const bustRateIndex = headerCells.findIndex(
      (cell) => cell.textContent === "Bust Rate"
    );
    if (bustRateIndex !== -1) {
      const bustRateCell = document.createElement("td");
      bustRateCell.textContent = winner.bustRate
        ? winner.bustRate.toFixed(1) + "%"
        : "N/A";
      row.appendChild(bustRateCell);
    }

    // Date (always the last column)
    const dateCell = document.createElement("td");
    dateCell.textContent = new Date(winner.date).toLocaleString();
    row.appendChild(dateCell);

    // Add the row to the table
    tableBody.appendChild(row);
  });
}
//# endregion render-leaderboard

//#region detailed-stats
// Function to show detailed stats in a modal
function showDetailedStats(winner, winners) {
  const modal = document.getElementById("stats-modal");
  const modalBody = document.getElementById("modal-body");

  // Set the modal title
  document.getElementById(
    "modal-title"
  ).textContent = `${winner.name}'s Game Stats`;

  // Clear previous content
  modalBody.innerHTML = "";

  // Calculate additional stats if not already present
  const bustRate = winner.bustRate || calculateBustRate(winner);

  // Display general stats
  const statsHTML = `
        <p><strong>Current Score:</strong> ${winner.score}</p>
        <p><strong>Total Turns:</strong> ${winner.turns}</p>
        <p><strong>Score/Turn Efficiency:</strong> ${winner.efficiency.toFixed(
          2
        )}</p>
        <p><strong>Bust Rate:</strong> ${bustRate.toFixed(1)}%</p>
        ${
          winner.totalUsers
            ? `<p><strong>Total Users:</strong> ${winner.totalUsers}</p>`
            : ""
        }
        <h3>Performance Ranking</h3>
        <p>Ranked <strong>${winners.indexOf(winner) + 1}</strong> out of ${
    winners.length
  } players</p>
        <h3>Turn History</h3>
        <ul>
          ${
            winner.turnHistory
              ? winner.turnHistory
                  .map(
                    (turn, index) => `
                  <li>
                    <strong>Turn ${index + 1}:</strong>
                    ${turn.busted ? "Busted!" : `Rolled ${turn.rollTotal}`}
                    ${turn.newTotal ? `(New Total: ${turn.newTotal})` : ""}
                  </li>
                `
                  )
                  .join("")
              : "<li>No turn history available.</li>"
          }
        </ul>
        <h3>Bust Rate Over Time</h3>
        <div class="bust-rate-chart"></div>
        <div class="stats-navigation">
          <button class="nav-button prev-button">&#8592; Previous</button>
          <div class="position-indicator">${winners.indexOf(winner) + 1} of ${
    winners.length
  }</div>
          <button class="nav-button next-button">Next &#8594;</button>
        </div>
      `;

  modalBody.innerHTML = statsHTML;

  // Render the bust rate chart
  renderBustRateChart(winner);

  // Show the modal
  modal.style.display = "block";

  // Add event listeners for navigation buttons
  const prevButton = modalBody.querySelector(".prev-button");
  const nextButton = modalBody.querySelector(".next-button");

  if (prevButton && nextButton) {
    const currentIndex = winners.indexOf(winner);

    prevButton.addEventListener("click", () => {
      const prevIndex = (currentIndex - 1 + winners.length) % winners.length;
      showDetailedStats(winners[prevIndex], winners);
    });

    nextButton.addEventListener("click", () => {
      const nextIndex = (currentIndex + 1) % winners.length;
      showDetailedStats(winners[nextIndex], winners);
    });
  }
}
//# endregion detailed-stats

//#region calculations
// Function to calculate bust rate
function calculateBustRate(winner) {
  if (!winner.turnHistory || winner.turnHistory.length === 0) return 0;
  const bustCount = winner.turnHistory.filter((turn) => turn.busted).length;
  return (bustCount / winner.turnHistory.length) * 100;
}

// Function to calculate average score per turn
function calculateAvgScorePerTurn(winner) {
  if (!winner.turnHistory || winner.turnHistory.length === 0) return 0;
  const totalScore = winner.turnHistory.reduce(
    (sum, turn) => sum + (turn.rollTotal || 0),
    0
  );
  return totalScore / winner.turnHistory.length;
}
//# endregion calculations

//#region chart-rendering
// Function to render the bust rate chart
function renderBustRateChart(winner) {
  const bustRateChartContainer = document.querySelector(".bust-rate-chart");
  bustRateChartContainer.innerHTML = "";

  // Extract data for the chart
  const turnLabels = winner.turnHistory
    ? winner.turnHistory.map((_, index) => `Turn ${index + 1}`)
    : [];
  const bustRates = calculateBustRatesOverTime(winner);

  // Create a wrapper for the chart to enable horizontal scrolling
  const chartWrapper = document.createElement("div");
  chartWrapper.classList.add("chart-wrapper");

  // Check if we have data to display
  if (bustRates.length === 0) {
    const noDataMsg = document.createElement("p");
    noDataMsg.textContent = "No turn history available for chart display.";
    bustRateChartContainer.appendChild(noDataMsg);
    return;
  }

  // Find the maximum bust rate for scaling
  const maxBustRate = Math.max(...bustRates);

  // Create bars for each turn
  turnLabels.forEach((label, index) => {
    const barContainer = document.createElement("div");
    barContainer.classList.add("bar-container");

    const barLabel = document.createElement("div");
    barLabel.classList.add("bar-label");
    barLabel.textContent = label;
    barContainer.appendChild(barLabel);

    const bar = document.createElement("div");
    bar.classList.add("bar");
    bar.style.height = `${(bustRates[index] / 100) * 150}px`; // Scale to 150px height
    bar.setAttribute("data-value", bustRates[index].toFixed(1) + "%");
    barContainer.appendChild(bar);

    chartWrapper.appendChild(barContainer);
  });

  bustRateChartContainer.appendChild(chartWrapper);
}
//# endregion chart-rendering

//#region file-operations
// Function to download the leaderboard as a JSON file
function downloadLeaderboard() {
  const winners = JSON.parse(localStorage.getItem("winners")) || [];
  const dataStr =
    "data:text/json;charset=utf-8," +
    encodeURIComponent(JSON.stringify(winners, null, 2));
  const downloadAnchor = document.createElement("a");
  downloadAnchor.setAttribute("href", dataStr);
  downloadAnchor.setAttribute("download", "leaderboard.json");
  document.body.appendChild(downloadAnchor);
  downloadAnchor.click();
  document.body.removeChild(downloadAnchor);
}

function uploadLeaderboard() {
  const fileInput = document.createElement("input");
  fileInput.type = "file";
  fileInput.accept = "application/json";

  fileInput.addEventListener("change", (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = function (e) {
      try {
        const uploadedData = JSON.parse(e.target.result);

        if (Array.isArray(uploadedData)) {
          // Calculate efficiency for any uploaded entries that don't have it
          uploadedData.forEach((winner) => {
            if (!winner.efficiency) {
              winner.efficiency = winner.score / winner.turns;
            }

            // Calculate additional stats if not already present
            if (
              !winner.avgScorePerTurn &&
              winner.turnHistory &&
              winner.turnHistory.length > 0
            ) {
              const totalScore = winner.turnHistory.reduce(
                (sum, turn) => sum + (turn.rollTotal || 0),
                0
              );
              winner.avgScorePerTurn = totalScore / winner.turnHistory.length;
            }

            if (
              !winner.bustRate &&
              winner.turnHistory &&
              winner.turnHistory.length > 0
            ) {
              const bustCount = winner.turnHistory.filter(
                (turn) => turn.busted
              ).length;
              winner.bustRate = (bustCount / winner.turnHistory.length) * 100;
            }
          });

          localStorage.setItem("winners", JSON.stringify(uploadedData));
          alert("Leaderboard uploaded successfully!");
          loadLeaderboard(); // Reload to update UI
        } else {
          alert("Invalid file format! Please upload a valid JSON file.");
        }
      } catch (error) {
        alert("Error processing the file! Make sure it's a valid JSON format.");
      }
    };

    reader.readAsText(file);
  });

  fileInput.click();
}
//# endregion file-operations

//#region helper-functions
// Function to calculate bust rates over time
function calculateBustRatesOverTime(winner) {
  if (!winner.turnHistory || winner.turnHistory.length === 0) return [];

  const bustRates = [];
  let bustCount = 0;

  winner.turnHistory.forEach((turn, index) => {
    if (turn.busted) bustCount++;
    const bustRate = (bustCount / (index + 1)) * 100;
    bustRates.push(bustRate);
  });

  return bustRates;
}

// Function to switch leaderboard view
function switchLeaderboardView(view) {
  const tableHead = document.querySelector("#leaderboard-table thead tr");
  tableHead.innerHTML = ""; // Clear existing headers

  // Update column headers based on selected view
  switch (view) {
    case "efficiency":
      updateColumns(["Rank", "Name", "Score", "Turns", "Score/Turns", "Date"]);
      break;
    case "performance":
      updateColumns([
        "Rank",
        "Name",
        "Score",
        "Turns",
        "Score/Turns",
        "Bust Rate",
        "Date",
      ]);
      break;
    case "advanced":
      updateColumns([
        "Rank",
        "Name",
        "Score",
        "Turns",
        "Score/Turns",
        "Bust Rate",
        "Date",
      ]);
      break;
    default:
      updateColumns(["Rank", "Name", "Score", "Turns", "Score/Turns", "Date"]);
  }

  // Re-render the leaderboard
  loadLeaderboard();
}

// Helper function to update column headers
function updateColumns(headers) {
  const tableHead = document.querySelector("#leaderboard-table thead tr");
  tableHead.innerHTML = "";

  headers.forEach((header) => {
    const th = document.createElement("th");
    th.textContent = header;
    tableHead.appendChild(th);
  });
}
//# endregion helper-functions

//#region initialization
// Load the leaderboard when the page loads
document.addEventListener("DOMContentLoaded", () => {
  loadLeaderboard();

  // Add event listeners for view switching
  if (document.getElementById("view-selector")) {
    document.getElementById("view-selector").addEventListener("change", (e) => {
      switchLeaderboardView(e.target.value);
    });
  }
});
//# endregion initialization
