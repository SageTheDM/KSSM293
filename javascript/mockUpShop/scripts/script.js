// Header Component
class Header extends HTMLElement {
    constructor() {
        super();
    }

    connectedCallback() {
        const cartItems = JSON.parse(localStorage.getItem('cart')) || [];

        this.innerHTML = `
      <header>
        <div class="header-content">
          <div><a href="index.html" class="project-name">Photofuel - Shop</a></div>
          <a href="cart.html" class="headerCartBtn">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512" class="cartIcon">
              <path fill="white" d="M0 24C0 10.7 10.7 0 24 0L69.5 0c22 0 41.5 12.8 50.6 32l411 0c26.3 0 45.5 25 38.6 50.4l-41 152.3c-8.5 31.4-37 53.3-69.5 53.3l-288.5 0 5.4 28.5c2.2 11.3 12.1 19.5 23.6 19.5L488 336c13.3 0 24 10.7 24 24s-10.7 24-24 24l-288.3 0c-34.6 0-64.3-24.6-70.7-58.5L77.4 54.5c-.7-3.8-4-6.5-7.9-6.5L24 48C10.7 48 0 37.3 0 24zM128 464a48 48 0 1 1 96 0 48 48 0 1 1 -96 0zm336-48a48 48 0 1 1 0 96 48 48 0 1 1 0-96z"/>
            </svg>
            <span class="cart-count">${cartItems.length}</span>
          </a>
          <button class="burger-menu" aria-label="Toggle menu">☰</button>
        </div>
      </header>
      <div class="div-menu">
        <ul class="menu">
          <li><a href="index.html#products">Unsere Produkte</a></li>
          <li><a href="index.html#faq">Häufig gestellte Fragen</a></li>
          <li><a href="index.html#about-us">Über uns</a></li>
          <li><a href="index.html#impressum">Impressum</a></li>
        </ul>
      </div>
    `;
    }
}

customElements.define('header-component', Header);

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
    priceElement.textContent = `Price: CHF ${price}`;
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

    // Create "Add to Cart" button
    const addToCartButton = document.createElement('button');
    addToCartButton.textContent = 'Add to Cart';
    addToCartButton.className = 'add-to-cart-button';
    addToCartButton.addEventListener('click', () => {
        addToCart({
            produktname,
            description,
            image,
            price,
            category,
            stock,
            rating,
            reviews
        });
    });
    cardContent.appendChild(addToCartButton);

    // Append card content to card
    card.appendChild(cardContent);

    // Append card to the container
    const container = document.getElementById('card-container');
    container.appendChild(card);
}

// Function to add an item to the cart and store it in localStorage
function addToCart(item) {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];

    // Remove CHF symbol from the price before saving
    const priceWithoutCHF = item.price.replace('CHF', '').trim();

    // Add the item with the modified price to the cart
    cart.push({
        ...item,
        price: priceWithoutCHF
    });

    localStorage.setItem('cart', JSON.stringify(cart));

    console.log('Item added to cart:', item);

    // Create a popup element
    const popup = document.createElement('div');
    popup.className = 'popup';
    popup.textContent = `${item.produktname} wurde zum Warenkorb hinzugefügt`;

    // Append the popup to the page
    document.body.appendChild(popup);

    // Remove the popup after 2 seconds
    setTimeout(() => {
        document.body.removeChild(popup);
    }, 2000);

    // Update cart count in the header
    const cartCount = document.querySelector('.cart-count');
    cartCount.textContent = cart.length;
}

// Load cards when the page loads
document.addEventListener('DOMContentLoaded', loadCards);
