class Footer extends HTMLElement {
  constructor() {
    super();
  }

  connectedCallback() {
    this.innerHTML = `
      <center>
          <footer>
          <div class="footer-content">
              <p>&copy; 2025 Photofuel.tech</p>
              <p>Mehr Infos unter: <a href="index.html#impressum">www.photofuel.tech/impressum</a></p>
          </div>     
        </footer>
      </center>
      `;
  }
}

customElements.define('footer-component', Footer);
