function showPopup(message) {
    const popup = document.createElement('div');
    popup.className = 'popup';

    const textElement = document.createElement('p');
    textElement.textContent = message;
    popup.appendChild(textElement);

    document.body.appendChild(popup);
    setTimeout(() => document.body.removeChild(popup), 2000);
}
