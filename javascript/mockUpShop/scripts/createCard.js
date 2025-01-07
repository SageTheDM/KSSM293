function createCard(produktname, description, image, price) {
    // Create card container
    const card = document.createElement('div');
    card.className = 'card';

    // Create image element
    const img = document.createElement('img');
    img.src = image;
    img.alt = produktname;
    img.className = 'card-image';
    card.appendChild(img);

    // Create card content container
    const cardContent = document.createElement('div');
    cardContent.className = 'card-content';

    // Add product name
    const title = document.createElement('h3');
    title.textContent = produktname;
    cardContent.appendChild(title);

    // Add description
    const desc = document.createElement('p');
    desc.textContent = description;
    cardContent.appendChild(desc);

    // Add price
    const priceElement = document.createElement('p');
    priceElement.textContent = `Price: ${price}`;
    priceElement.className = 'card-price';
    cardContent.appendChild(priceElement);

    // Append card content to card
    card.appendChild(cardContent);

    // Append card to the body or a specific container
    const container = document.getElementById('card-container');
    container.appendChild(card);
}
