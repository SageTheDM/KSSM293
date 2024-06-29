// @license https://creativecommons.org/licenses/by-sa/4.0/ CC-BY-SA-4.0
function toggleMenu() {
    const menu = document.querySelector(".menu");
    menu.classList.toggle("active");
    
    // Add event listener to close menu when clicking anywhere on the document
    if (menu.classList.contains("active")) {
        document.addEventListener("click", closeMenu);
    } else {
        document.removeEventListener("click", closeMenu);
    }
}

function closeMenu(event) {
    const menu = document.querySelector(".menu");
    if (!menu.contains(event.target) && !event.target.classList.contains("burger-menu")) {
        menu.classList.remove("active");
        document.removeEventListener("click", closeMenu);
    }
}
// @license-end