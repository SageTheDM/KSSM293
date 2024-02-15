let slideIndex = 1;

// Function to show next/previous slide
function plusSlides(n) {
    showSlides(slideIndex += n);
}

// Function to display current slide
function showSlides(n) {
    const slides = document.getElementsByClassName("mySlides");
    if (n > slides.length) {
        slideIndex = 1;
    }
    if (n < 1) {
        slideIndex = slides.length;
    }
    for (let i = 0; i < slides.length; i++) {
        slides[i].style.display = "none";
    }
    slides[slideIndex - 1].style.display = "block";
}

// Initialize slideshow
showSlides(slideIndex);

// Count-up clocks
const countups = [
    { id: "countup1", startDate: new Date("November 7, 2023 07:44:00").getTime() },
    // Add more count-ups as needed
];

countups.forEach((countup) => {
    initializeClock(countup);
});

function initializeClock(countup) {
    var x = setInterval(function () {
        var now = new Date().getTime();
        var elapsedTime = now - countup.startDate;

        var days = Math.floor(elapsedTime / (1000 * 60 * 60 * 24));
        var hours = Math.floor((elapsedTime % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        var minutes = Math.floor((elapsedTime % (1000 * 60 * 60)) / (1000 * 60));
        var seconds = Math.floor((elapsedTime % (1000 * 60)) / 1000);

        // Format the count-up
        var countupFormatted = formatCountup(days, hours, minutes, seconds);

        document.getElementById(countup.id).innerHTML = countupFormatted;

        // Additional information
        var months = Math.floor(elapsedTime / (1000 * 60 * 60 * 24 * 30.44));
        var weeks = Math.floor(elapsedTime / (1000 * 60 * 60 * 24 * 7));

        document.getElementById(countup.id + "-months").innerHTML = "Months: " + months;
        document.getElementById(countup.id + "-weeks").innerHTML = "Weeks: " + weeks;
        document.getElementById(countup.id + "-days").innerHTML = "Days: " + days;

    }, 1000);
}

// Function to format the count-up
function formatCountup(days, hours, minutes, seconds) {
    return days + "d " + pad(hours, 2) + "h " + pad(minutes, 2) + "m " + pad(seconds, 2) + "s";
}

// Function to pad numbers with leading zeros
function pad(number, length) {
    var str = '' + number;
    while (str.length < length) {
        str = '0' + str;
    }
    return str;
}
