document.addEventListener("DOMContentLoaded", () => {
    const menu = document.querySelector(".menu");
    const burgerMenu = document.querySelector(".burger-menu");

    if (!menu || !burgerMenu) {
        console.warn("Menu or burger menu element not found.");
        return;
    }

    // Ensure the menu starts hidden
    menu.classList.add("notActive");

    function toggleMenu() {
        if (menu.classList.contains("active")) {
            // Start hiding the menu
            menu.classList.remove("active");

            // Wait for the animation to finish before hiding it completely
            setTimeout(() => {
                if (!menu.classList.contains("active")) {
                    menu.classList.add("notActive");
                }
            }, getComputedStyle(menu).getPropertyValue("--menu-animation-duration").replace("s", "") * 1000);

            document.removeEventListener("click", closeMenu);
        } else {
            // Make it visible immediately, then trigger the animation
            menu.classList.remove("notActive");
            setTimeout(() => menu.classList.add("active"), 10); // Small delay to ensure transition runs

            document.addEventListener("click", closeMenu);
        }
    }

    function closeMenu(event) {
        if (!menu.contains(event.target) && event.target !== burgerMenu) {
            toggleMenu();
        }
    }

    burgerMenu.addEventListener("click", (event) => {
        event.stopPropagation();
        toggleMenu();
    });
});
