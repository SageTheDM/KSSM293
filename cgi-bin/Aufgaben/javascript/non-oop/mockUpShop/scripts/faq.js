// Funktion, um die FAQ-Daten zu laden
async function loadFAQ() {
  const response = await fetch("json/faq-data.json");
  const faqData = await response.json();
  renderFAQ(faqData);
}

// Funktion, um die FAQ anzuzeigen
function renderFAQ(faqData) {
  const faqContainer = document.getElementById("faq-display");
  faqContainer.innerHTML = "";
  faqData.forEach((item, index) => {
    const question = document.createElement("div");
    question.classList.add("faq-item");
    question.textContent = item.question;
    question.onclick = () => toggleAnswer(index);

    const answer = document.createElement("div");
    answer.classList.add("faq-answer");
    answer.textContent = item.answer;
    answer.setAttribute("id", `answer-${index}`);

    faqContainer.appendChild(question);
    faqContainer.appendChild(answer);
  });
}

// Funktion, um die Antwort ein- oder auszublenden
function toggleAnswer(index) {
  const answer = document.getElementById(`answer-${index}`);
  const isOpen = answer.classList.contains("open");

  document.querySelectorAll(".faq-answer").forEach((el) => el.classList.remove("open"));

  if (!isOpen) {
    answer.classList.add("open");
  }
}

// Funktion für die Suchfunktionalität
function filterFAQ() {
  const searchTerm = document.getElementById("search").value.toLowerCase();
  document.querySelectorAll(".faq-item").forEach((item, index) => {
    const isVisible = item.textContent.toLowerCase().includes(searchTerm);
    item.style.display = isVisible ? "block" : "none";
    document.getElementById(`answer-${index}`).classList.remove("open");
  });
}

// FAQ-Daten laden
loadFAQ();
