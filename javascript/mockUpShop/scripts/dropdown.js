// @license magnet:?xt=urn:btih:0b31508aeb0634b347b8270c7bee4d411b5d4109&dn=agpl-3.0.txt AGPL-3.0

/*
 *        Photofuel - store
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

document.addEventListener("DOMContentLoaded", () => {
    const menu = document.querySelector(".menu");
    const burgerMenu = document.querySelector(".burger-menu");

    if (!menu || !burgerMenu) {
        console.warn("Menu or burger menu element not found. Ensure they exist in the DOM.");
        return;
    }

    // Toggle the menu visibility
    function toggleMenu() {
        menu.classList.toggle("active");

        if (menu.classList.contains("active")) {
            // Add click listener to close menu when clicking outside
            document.addEventListener("click", closeMenu);
        } else {
            // Remove the click listener when menu is closed
            document.removeEventListener("click", closeMenu);
        }
    }

    // Close the menu if clicking outside of it
    function closeMenu(event) {
        if (!menu.contains(event.target) && !event.target.classList.contains("burger-menu")) {
            menu.classList.remove("active");
            document.removeEventListener("click", closeMenu);
        }
    }

    // Attach click event to the burger menu button
    burgerMenu.addEventListener("click", (event) => {
        event.stopPropagation(); // Prevent click from immediately triggering closeMenu
        toggleMenu();
    });
});
// @license-end