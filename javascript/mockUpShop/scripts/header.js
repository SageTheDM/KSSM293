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
            <li><a href="index.html#shop">Our Shop</a></li>
            <li><a href="index.html#faq">Our Faq</a></li>
            <li><a href="index.html#about">About us</a></li>
          </ul>
      </div>
    `;
  }
}

customElements.define('header-component', Header);
