document.addEventListener("DOMContentLoaded", function () {
    const autofillCheckbox = document.getElementById("autofill-settings");
    const fields = ["firstname", "lastname", "email", "phone", "street", "number", "zipcode", "city"];
    const saveButton = document.getElementById("save-settings");
    const clearButton = document.getElementById("clear-settings");

    // Lädt die gespeicherten Werte aus dem LocalStorage
    function loadSettings() {
        fields.forEach(field => {
            const savedValue = localStorage.getItem(field);
            const input = document.getElementById(field);
            if (input && savedValue) {
                input.value = savedValue; // Pre-fill field with saved value if exists
            }
        });

        const autofillEnabled = localStorage.getItem("autofillEnabled");
        autofillCheckbox.checked = autofillEnabled === "true"; // Check the autofill checkbox if enabled
    }

    function siteReload() {
        setTimeout(function () {
            window.location.reload();
        }, 2000); // 2000 milliseconds = 2 seconds
    }

    // Speichert die aktuellen Werte im LocalStorage
    function saveSettings() {

        fields.forEach(field => {
            const input = document.getElementById(field);
            if (input) {
                const value = input.value.trim();
                if (value) {
                    localStorage.setItem(field, value); // Save field value individually
                }
            }
        });

        localStorage.setItem("autofillEnabled", autofillCheckbox.checked); // Save autofill setting
        showPopup("Einstellungen gespeichert!");
        siteReload();
    }

    // Löscht alle gespeicherten Werte
    function clearSettings() {
        const userConfirmed = window.confirm("Bist du sicher, dass du alle Einstellungen löschen möchtest?");

        if (userConfirmed) {
            fields.forEach(field => {
                localStorage.removeItem(field); // Remove individual field from localStorage
                const input = document.getElementById(field);
                if (input) input.value = ""; // Clear the field
            });

            localStorage.removeItem("autofillEnabled"); // Remove autofill setting
            autofillCheckbox.checked = false; // Uncheck the autofill checkbox
            showPopup("Einstellungen zurückgesetzt!");
            siteReload();
        } else {
            console.log("Löschen abgebrochen.");
        }
    }

    // Event Listener für Buttons
    if (saveButton) saveButton.addEventListener("click", saveSettings);
    if (clearButton) clearButton.addEventListener("click", clearSettings);
    autofillCheckbox.addEventListener("change", () => localStorage.setItem("autofillEnabled", autofillCheckbox.checked));

    loadSettings();
});
