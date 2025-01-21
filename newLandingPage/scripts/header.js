// Header Component
class Header extends HTMLElement {
  constructor() {
    super();
  }
  connectedCallback() {
    this.innerHTML = `
      <header>
        <div class="header-content">
          <div><a href="index.html" class="project-name">Photofuel</a></div>
          <button class="burger-menu" aria-label="Toggle menu">☰</button>
        </div>
      </header>
      <div class="div-menu">
        <ul class="menu">
          <li><a href="index.html#about">About me</a></li>
          <li><a href="index.html#scool">Tasks from scool</a></li>
          <li><a href="index.html#private">Private Code</a></li>
          <li><a href="index.html#interstellar">Interstellardevelopment</a></li>
          <li><a href="photos.html">Photography</a></li>
        </ul>
      </div>
      `;
  }
}

customElements.define('header-component', Header);
