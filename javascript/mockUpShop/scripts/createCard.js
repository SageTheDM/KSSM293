// Function to fetch JSON and create cards
async function loadCards() {
    try {
        // Fetch the JSON file
        const response = await fetch('json/inventory.json');
        if (!response.ok) throw new Error('Failed to fetch inventory.json');

        // Parse the JSON data
        const inventory = await response.json();

        // Loop through each item and create a card
        inventory.forEach(item => {
            createCard(
                item.produktname,
                item.beschreibung,
                item.bild,
                item.preis,
                item.kategorie,
                item.lagerbestand,
                item.bewertung,
                item.bewertungen
            );
        });
    } catch (error) {
        console.error('Error loading cards:', error);
    }
}

// Function to create a single card
function createCard(produktname, description, image, price, category, stock, rating, reviews) {
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

    // Add category
    const categoryElement = document.createElement('p');
    categoryElement.textContent = `Category: ${category}`;
    categoryElement.className = 'card-category';
    cardContent.appendChild(categoryElement);

    // Add stock
    const stockElement = document.createElement('p');
    stockElement.textContent = `Stock: ${stock}`;
    stockElement.className = 'card-stock';
    cardContent.appendChild(stockElement);

    // Add rating and reviews
    const ratingElement = document.createElement('p');
    ratingElement.textContent = `Rating: ${rating} (${reviews} reviews)`;
    ratingElement.className = 'card-rating';
    cardContent.appendChild(ratingElement);

    // Append card content to card
    card.appendChild(cardContent);

    // Append card to the container
    const container = document.getElementById('card-container');
    container.appendChild(card);
}

// Load cards when the page loads
document.addEventListener('DOMContentLoaded', loadCards);
