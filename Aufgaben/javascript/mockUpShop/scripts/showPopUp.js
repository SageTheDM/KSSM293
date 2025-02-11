// Funktion zum Erstellen eines Popups
function showPopup(message) {
    const popup = document.createElement('div');
    popup.className = 'popup';
    popup.textContent = message;
    document.body.appendChild(popup);
    setTimeout(() => document.body.removeChild(popup), 2000);
}
