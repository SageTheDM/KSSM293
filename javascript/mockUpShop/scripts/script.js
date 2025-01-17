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
          <li><a href="settings.html">Lokale Einstellungen</a></li>
        </ul>
      </div>
      `;
  }
}

customElements.define('header-component', Header);

// Function to fetch JSON and create cards
async function loadCards() {
  try {
    const response = await fetch('json/inventory.json');
    if (!response.ok) throw new Error('Failed to fetch inventory.json');
    const inventory = await response.json();

    inventory.forEach(item => {
      createCard(
        item.produktname,
        item.beschreibung,
        item.bild,
        item.preis,
        item.kategorie,
        item.lagerbestand,
        item.bewertung,
        item.bewertungen,
        item.Herkunft.geokoordinaten.breite,
        item.Herkunft.geokoordinaten.laenge
      );
    });
  } catch (error) {
    console.error('Error loading cards:', error);
  }
}

// Function to create a single card
function createCard(produktname, description, image, price, category, stock, rating, reviews, latitude, longitude) {
  const card = document.createElement('div');
  card.className = 'card';

  const img = document.createElement('img');
  img.src = image;
  img.alt = produktname;
  img.className = 'card-image';
  card.appendChild(img);

  const cardContent = document.createElement('div');
  cardContent.className = 'card-content';

  const title = document.createElement('h3');
  title.textContent = produktname;
  cardContent.appendChild(title);

  const desc = document.createElement('p');
  desc.textContent = description;
  cardContent.appendChild(desc);

  const priceElement = document.createElement('p');
  priceElement.textContent = `Price: ${price}`;
  priceElement.className = 'card-price';
  cardContent.appendChild(priceElement);

  const categoryElement = document.createElement('p');
  categoryElement.textContent = `Category: ${category}`;
  categoryElement.className = 'card-category';
  cardContent.appendChild(categoryElement);

  const stockElement = document.createElement('p');
  stockElement.textContent = `Stock: ${stock}`;
  stockElement.className = 'card-stock';
  cardContent.appendChild(stockElement);

  const ratingElement = document.createElement('p');
  ratingElement.textContent = `Rating: ${rating} (${reviews} reviews)`;
  ratingElement.className = 'card-rating';
  cardContent.appendChild(ratingElement);

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

  const expandButton = document.createElement('button');
  expandButton.textContent = 'Expand';
  expandButton.className = 'expand-button';
  cardContent.appendChild(expandButton);

  const detailedSection = document.createElement('div');
  detailedSection.className = 'detailed-section';
  detailedSection.style.display = 'none';

  const mapContainer = document.createElement('div');
  mapContainer.className = 'map-container';
  const mapIframe = document.createElement('iframe');
  mapIframe.src = `https://www.google.com/maps?q=${latitude},${longitude}&hl=de`;
  mapIframe.width = '400';
  mapIframe.height = '300';
  mapIframe.style.transition = 'all 0.5s ease';
  mapContainer.appendChild(mapIframe);

  const details = document.createElement('div');
  details.className = 'more-details';
  details.innerHTML = `<p>More details about the product...</p><p>Additional information...</p>`;
  detailedSection.appendChild(mapContainer);
  detailedSection.appendChild(details);
  cardContent.appendChild(detailedSection);

  expandButton.addEventListener('click', () => {
    if (detailedSection.style.display === 'none') {
      detailedSection.style.display = 'block';
      mapIframe.style.height = '500px';
    } else {
      detailedSection.style.display = 'none';
      mapIframe.style.height = '300px';
    }
  });

  card.appendChild(cardContent);

  const container = document.getElementById('card-container');
  container.appendChild(card);
}

// Function to add an item to the cart and update localStorage
function addToCart(item) {
  let cart = JSON.parse(localStorage.getItem('cart')) || [];
  cart.push(item);
  localStorage.setItem('cart', JSON.stringify(cart));

  const popup = document.createElement('div');
  popup.className = 'popup';
  popup.textContent = `${item.produktname} wurde zum Warenkorb hinzugefügt`;
  document.body.appendChild(popup);
  setTimeout(() => document.body.removeChild(popup), 2000);

  const cartCount = document.querySelector('.cart-count');
  cartCount.textContent = cart.length;
}

document.addEventListener('DOMContentLoaded', loadCards);
