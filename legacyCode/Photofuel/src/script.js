// @license magnet:?xt=urn:btih:90dc5c0be029de84e523b9b3922520e79e0e6f08&dn=cc0.txt CC0-1.0
// Ticket System
function submitForm() {
    var firstName = document.getElementById("fname").value;
    var lastName = document.getElementById("lname").value;
    var problem = document.getElementById("problem").value;
    var email = document.getElementById("email").value;
    var subject = document.getElementById("subject").value;

    var ticketNumber = Math.floor(Math.random() * 90000) + 10000;

    var message = "Subject: " + ticketNumber + " " + subject + "\n\n";
    message += "Hello " + firstName + " " + lastName + "\n\n";
    message += "We received your email and created a ticket for it. We will work on it and get back to you.\n\n";
    message += "If we don't, please give us a call and provide the ticket number to us.\n\n";
    message += "Ticket Number: " + ticketNumber + "\n";
    message += "Your Email: " + email + "\n";
    message += "Kind regards" + "\n"
    message += "Dev Team" + "\n"
    message += "076-306-72-03"

    var supportEmail = "info@photofuel.tech";
    var mailToUrl = "mailto:" + encodeURIComponent(supportEmail + " ; " + email + "; ") + "?subject=" + encodeURIComponent(ticketNumber + " " + subject) + "&body=" + encodeURIComponent(message);
    window.location.href = mailToUrl;

    return false;
}

// Function to toggle dark mode
function toggleDarkMode() {
    const body = document.body;
    body.classList.toggle('dark-mode');
    // Save the user's preference in local storage
    const isDarkMode = body.classList.contains('dark-mode');
    localStorage.setItem('darkMode', isDarkMode);
}

// Check if the user has a dark mode preference
const darkModeOn = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;

// Set initial state based on user's preference
if (darkModeOn) {
    document.body.classList.add('dark-mode');
}

// Event listener for dark mode toggle button
const darkModeToggle = document.getElementById('darkModeToggle');
if (darkModeToggle) {
    darkModeToggle.addEventListener('click', function () {
        toggleDarkMode();
    });

    // Load user's preference from local storage
    const savedDarkMode = localStorage.getItem('darkMode');
    if (savedDarkMode === 'true') {
        document.body.classList.add('dark-mode');
    }
}

// Dropdown Menu
document.addEventListener("DOMContentLoaded", function () {
    var dropdownBtn = document.querySelector(".header2 .dropdown .header-button");
    var dropdownContent = document.querySelector(".header2 .dropdown-content");

    dropdownBtn.addEventListener("click", function () {
        dropdownContent.classList.toggle("show");
    });

    // Close the dropdown if the user clicks outside of it
    window.onclick = function (event) {
        if (!event.target.matches('.header2 .dropdown .header-button')) {
            var dropdowns = document.getElementsByClassName("dropdown-content");
            for (var i = 0; i < dropdowns.length; i++) {
                var openDropdown = dropdowns[i];
                if (openDropdown.classList.contains('show')) {
                    openDropdown.classList.remove('show');
                }
            }
        }
    };
});
// @license-end