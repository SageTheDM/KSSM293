// @license magnet:?xt=urn:btih:90dc5c0be029de84e523b9b3922520e79e0e6f08&dn=cc0.txt CC0-1.0
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