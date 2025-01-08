class Footer extends HTMLElement {
    constructor() {
        super();
    }

    connectedCallback() {
        this.innerHTML = `
      <center>
          <footer>
          <div class="footer-content">
              <p>2025 Photofuel</p>
          </div>     
        </footer>
      </center>
      `;
    }
}

customElements.define('footer-component', Footer);
