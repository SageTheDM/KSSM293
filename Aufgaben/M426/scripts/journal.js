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
                            <button class="accordion-button ${index === 0 ? "" : "collapsed"}" 
                                    type="button" data-bs-toggle="collapse" 
                                    data-bs-target="#collapse${index}" 
                                    aria-expanded="${index === 0 ? "true" : "false"}" 
                                    aria-controls="collapse${index}">
                                ${lesson.title}
                            </button>
                        </h2>
                        <div id="collapse${index}" class="accordion-collapse collapse ${index === 0 ? "show" : ""}" 
                             aria-labelledby="heading${index}" 
                             data-bs-parent="#journalAccordion">
                            <div class="accordion-body">
                                <ul>
                                    ${lesson.entries
                        .map(
                            (entry) =>
                                `<li class="journal-entry"><span class="entry-title">${entry.title}</span>: ${entry.description}</li>`
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
