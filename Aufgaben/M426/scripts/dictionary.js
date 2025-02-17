document.addEventListener("DOMContentLoaded", () => {
    fetch("json/dictionary.json")
        .then((response) => response.json())
        .then((data) => {
            function populateSection(sectionId, words) {
                const section = document.getElementById(sectionId);
                if (!words.length) {
                    section.innerHTML = "<p>No words available.</p>";
                    return;
                }
                section.innerHTML = words
                    .map(
                        (word) =>
                            `<p><span class="dictionary-term">${word.term}</span>: ${word.definition}</p>`
                    )
                    .join("");
            }

            populateSection("knownWords", data.known_words);
            populateSection("knownButNotUsed", data.known_but_not_used);
            populateSection("unknownWords", data.unknown_words);
        })
        .catch((error) => {
            console.error("Error loading dictionary:", error);
            document.getElementById("dictionaryAccordion").innerHTML =
                "<p class='text-danger'>Failed to load dictionary.</p>";
        });
});