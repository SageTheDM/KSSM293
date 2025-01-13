class Header extends HTMLElement {
  constructor() {
    super();
  }

  connectedCallback() {
    this.innerHTML = `
      <header>
        <div class="header-content">
          <div><a href="index.html" class="project-name">Photofuel - Shop</a></div>
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
