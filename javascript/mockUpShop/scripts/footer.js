// @license magnet:?xt=urn:btih:0b31508aeb0634b347b8270c7bee4d411b5d4109&dn=agpl-3.0.txt AGPL-3.0

/*
            Photofuel - store
 *        Copyright (C) Luca Fabian Burger
 *
 *        This program is free software: you can redistribute it and/or modify
 *        it under the terms of the GNU Affero General Public License as
 *        published by the Free Software Foundation, either version 3 of the
 *        License, or (at your option) any later version.
 *
 *        This program is distributed in the hope that it will be useful,
 *        but WITHOUT ANY WARRANTY; without even the implied warranty of
 *        MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 *        GNU Affero General Public License for more details.
 *
 *        You should have received a copy of the GNU Affero General Public License
 *        along with this program.  If not, see <https://www.gnu.org/licenses/>.
 */

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

        // Add event listener for button click
        this.querySelector('.secret-button').addEventListener('click', () => {
            window.open('secret/index.html', '_blank');
        });
    }
}

customElements.define('footer-component', Footer);

// @license-end
