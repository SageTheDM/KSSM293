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
          <li><a href="index.html#danke">Danksagung</a></li>
          <li><a href="settings.html">Lokale Einstellungen</a></li>
        </ul>
      </div>
    `;
  }
}

customElements.define('header-component', Header);

// Function to load JSON and create cards
async function loadCards() {
  try {
    const response = await fetch('json/inventory.json');
    if (!response.ok) throw new Error('Fehler beim Laden der inventory.json');
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
        item.TechnischeDaten // Ensure this is passed
      );
    });

  } catch (error) {
    console.error('Fehler beim Laden der Karten:', error);
  }
}

// Function to create a single card
function createCard(produktname, description, image, price, category, stock, rating, reviews, technicalData) {
  const card = document.createElement('div');
  card.className = 'card';

  const img = document.createElement('img');
  // If an image is provided, use it; otherwise use a fallback
  img.src = image ? "images/" + image : 'images/fallback-product.jpg';
  img.alt = produktname;
  img.className = 'card-image';

  // Fallback image if an error occurs
  img.onerror = () => {
    img.src = 'images/fallback-product.jpg';
  };

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
  priceElement.textContent = `Preis: ${price} CHF`;
  priceElement.className = 'card-price';
  cardContent.appendChild(priceElement);

  const categoryElement = document.createElement('p');
  categoryElement.textContent = `Kategorie: ${category}`;
  categoryElement.className = 'card-category';
  cardContent.appendChild(categoryElement);

  const stockElement = document.createElement('p');
  stockElement.textContent = `Bestand: ${stock}`;
  stockElement.className = 'card-stock';
  cardContent.appendChild(stockElement);

  const ratingElement = document.createElement('p');
  ratingElement.textContent = `Bewertung: ${rating} (${reviews} Bewertungen)`;
  ratingElement.className = 'card-rating';
  cardContent.appendChild(ratingElement);

  const addToCartButton = document.createElement('button');
  addToCartButton.textContent = 'In den Warenkorb';
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
      reviews,
    });
  });
  cardContent.appendChild(addToCartButton);

  const expandButtonContainer = document.createElement('div');
  expandButtonContainer.className = 'expand-button-container';

  const expandButton = document.createElement('button');
  expandButton.textContent = 'Erweitern';
  expandButton.className = 'expand-button';
  expandButtonContainer.appendChild(expandButton);
  cardContent.appendChild(expandButtonContainer);

  const detailedSection = document.createElement('div');
  detailedSection.className = 'detailed-section';
  detailedSection.style.display = 'none';

  // Create table for technical data
  const technicalTable = document.createElement('table');
  technicalTable.className = 'technical-table';

  if (technicalData) {
    const tableHeader = document.createElement('tr');
    const keyHeader = document.createElement('th');
    keyHeader.textContent = 'Eigenschaft';
    const valueHeader = document.createElement('th');
    valueHeader.textContent = 'Wert';
    tableHeader.appendChild(keyHeader);
    tableHeader.appendChild(valueHeader);
    technicalTable.appendChild(tableHeader);

    Object.keys(technicalData).forEach((key) => {
      const row = document.createElement('tr');
      const keyCell = document.createElement('td');
      keyCell.textContent = key;
      const valueCell = document.createElement('td');
      valueCell.textContent = technicalData[key];
      row.appendChild(keyCell);
      row.appendChild(valueCell);
      technicalTable.appendChild(row);
    });
  }

  detailedSection.appendChild(technicalTable);

  // Add close button to detailed section
  const closeButton = document.createElement('button');
  closeButton.textContent = 'Schliessen';
  closeButton.className = 'close-button';
  detailedSection.appendChild(closeButton);

  // Event Listener for the close button
  closeButton.addEventListener('click', () => {
    card.style.gridColumnEnd = ''; // Reset layout
    card.style.gridRowEnd = ''; // Reset layout
    detailedSection.style.display = 'none'; // Hide detailed view
  });

  cardContent.appendChild(detailedSection);

  // Event Listener for the expand button
  expandButton.addEventListener('click', () => {
    const cardRect = card.getBoundingClientRect();
    const availableWidth = window.innerWidth - cardRect.left - cardRect.width;
    const availableHeight = window.innerHeight - cardRect.top - cardRect.height;

    if (availableWidth > 500) {
      card.style.gridColumnEnd = 'span 2'; // Expand along X-axis
      detailedSection.style.display = 'block';
    } else if (availableHeight > 500) {
      card.style.gridRowEnd = 'span 2'; // Expand along Y-axis
      detailedSection.style.display = 'block';
    } else {
      card.style.gridColumnEnd = 'span 2';
      card.style.gridRowEnd = 'span 2';
      detailedSection.style.display = 'block';
    }
  });

  card.appendChild(cardContent);

  // Use querySelector to select the container by its class
  const container = document.querySelector('.card-container');
  container.appendChild(card);
}

// Function to add an item to the cart and update localStorage
function addToCart(item) {
  let cart = JSON.parse(localStorage.getItem('cart')) || [];
  cart.push(item);
  localStorage.setItem('cart', JSON.stringify(cart));

  showPopup(`${item.produktname} wurde zum Warenkorb hinzugefügt`);

  const cartCount = document.querySelector('.cart-count');
  cartCount.textContent = cart.length;
}

document.addEventListener('DOMContentLoaded', loadCards);
