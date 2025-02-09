// Funktion, um die FAQ-Daten zu laden
async function loadFAQ() {
    const response = await fetch('json/faq-data.json');
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
    const allAnswers = document.querySelectorAll(".faq-answer");
    allAnswers.forEach((el, i) => {
        el.classList.remove("open"); // Alle Antworten schliessen
    });

    const answer = document.getElementById(`answer-${index}`);
    answer.classList.toggle("open"); // Antwort umschalten
}

// Funktion für die Suchfunktionalität
function filterFAQ() {
    const searchTerm = document.getElementById("search").value.toLowerCase();
    document.querySelectorAll(".faq-item").forEach((item, index) => {
        const answer = document.getElementById(`answer-${index}`);
        const isVisible = item.textContent.toLowerCase().includes(searchTerm);
        item.style.display = isVisible ? "block" : "none";
        answer.style.display = "none"; // Bei Suchergebnissen die Antwort verstecken
    });
}

// FAQ-Daten laden
loadFAQ();