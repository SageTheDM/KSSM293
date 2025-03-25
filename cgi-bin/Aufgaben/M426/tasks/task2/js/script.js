"use strict";

document.querySelector("h1").style.color = "#02ff00";

document.getElementById("footer").addEventListener("click", function () {
  const body = document.body;
  body.classList.toggle("clickedFooter");
});

document.getElementById("header").addEventListener("click", function () {
  const header = document.getElementById("header");
  header.classList.toggle("clicked");
});

function contentAdd() {
  let newParagraph = document.createElement("p");
  newParagraph.textContent =
    "Es ist nicht auszuschliessen, dass Leben auf dem Asteroiden möglich ist.";
  const content = document.getElementById("content");
  content.appendChild(newParagraph);
}

function divAdd() {
  let numberDiv;

  numberDiv = document.createElement("div");
  numberDiv.id = "number";
  document.getElementById("content").appendChild(numberDiv);
}

function generateRandomNumber() {
  const randomNumber = Math.floor(Math.random() * 100 + 1);
  numberDiv.textContent = randomNumber;
}

contentAdd();
divAdd();
generateRandomNumber();
setInterval(generateRandomNumber, 5000);
