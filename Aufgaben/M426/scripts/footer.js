class FooterContent extends HTMLElement {
    connectedCallback() {
        this.innerHTML = `
            <footer class="bg-dark text-white text-center py-3">
                <p>&copy; Photofuel.tech | Luca Burger</p>
            </footer>
        `;
    }
}

customElements.define('footer-content', FooterContent);
