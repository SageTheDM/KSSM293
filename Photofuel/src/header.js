// @license magnet:?xt=urn:btih:90dc5c0be029de84e523b9b3922520e79e0e6f08&dn=cc0.txt CC0-1.0
class Header extends HTMLElement {
  constructor() {
    super();
  }

  connectedCallback() {
    this.innerHTML = `
      <style>
        
      </style>
      <header>
        <div class="header-content">
          <div><a href="index.html" class="project-name">Photofuel</a></div>
          <button class="burger-menu" onclick="toggleMenu()">☰</button>
          <a href="https://www.youtube.com/@sage_the_dm" class="right-logo">
            <img src="../../assets/LogoYT.jpg" alt="Logo" class="menu-logo">
          </a>
          <div class="right-toggle">
            <img src="../../assets/button v2.png" id="darkModeToggle" alt="Light/Darkmode" class="header-button">
          </div>
        </div>     
      </header>
      <div class="div-menu">
        <ul class="menu">
          <li><a href="index.html">Home</a></li>
          <li><a href="Photogallery.html">Photos</a></li>
          <li><a href="Setup.html">My Setup</a></li>
          <li><a href="post.html">Post production</a></li>
          <li><a href="trips.html">Photo sessions</a></li>
        </ul>
      </div> 
    `;
  }
}

customElements.define('header-component', Header);
// @license-end