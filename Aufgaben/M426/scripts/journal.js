document.addEventListener("DOMContentLoaded", () => {
  fetch("json/journal.json")
    .then((response) => response.json())
    .then((data) => {
      const journalContainer = document.getElementById("journalAccordion");
      journalContainer.innerHTML = "";

      data.lessons.forEach((lesson, index) => {
        const lessonElement = document.createElement("div");
        lessonElement.classList.add("accordion-item");

        lessonElement.innerHTML = `
            <h2 class="accordion-header" id="heading${index}">
                <button class="accordion-button collapsed" 
                        type="button" data-bs-toggle="collapse" 
                        data-bs-target="#collapse${index}" 
                        aria-expanded="false" 
                        aria-controls="collapse${index}">
                    ${lesson.title}
                </button>
            </h2>
            <div id="collapse${index}" class="accordion-collapse collapse" 
                 aria-labelledby="heading${index}" 
                 data-bs-parent="#journalAccordion">
                <div class="accordion-body">
                    <ul>
                        ${lesson.entries
                          .map(
                            (entry) => `
                              <li class="journal-entry">
                                <span class="entry-title">${entry.title}</span> 
                                <p>${entry.description}</p>
                                ${
                                  entry.code
                                    ? `<pre class="code-box"><code class="language-javascript">${escapeHtml(
                                        entry.code
                                      )}</code></pre>`
                                    : ""
                                }
                                ${
                                  entry.image
                                    ? `<div class="image-container"><img src="${entry.image}" alt="${entry.title}" class="journal-image"></div>`
                                    : ""
                                }
                              </li>`
                          )
                          .join("")}
                    </ul>
                </div>
            </div>
          `;

        journalContainer.appendChild(lessonElement);
      });
    })
    .catch((error) => {
      console.error("Error loading learning journal:", error);
      document.getElementById("journalAccordion").innerHTML =
        "<p class='text-danger'>Failed to load learning journal.</p>";
    });
});

// Function to escape HTML for displaying inside <code> tags
function escapeHtml(str) {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}
