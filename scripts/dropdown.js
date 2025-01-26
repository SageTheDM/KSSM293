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
