// Path to the JSON file
const jsonPath = "json/pictures.json";

// Default image path
const defaultImage = "images/Picture (1).jpg";

// Function to create an image element wrapped in a link
const createImageElement = (src, alt) => {
    const link = document.createElement("a");
    link.href = src;
    link.target = "_blank"; // Open in a new tab

    const img = document.createElement("img");
    img.src = src;
    img.alt = alt;
    img.onerror = () => { img.src = defaultImage; }; // Fallback to default image if loading fails

    link.appendChild(img);
    return link;
};

// Function to load the gallery
const loadGallery = async () => {
    try {
        const response = await fetch(jsonPath);
        const data = await response.json();

        data.forEach(entry => {
            let sectionId;
            if (entry.pictureKind === "Bike") {
                sectionId = entry.bikeKind.toLowerCase();
            } else if (entry.pictureKind === "Travel") {
                sectionId = entry.location.toLowerCase();
            } else if (entry.pictureKind === "Portrait") {
                sectionId = "portrait";
            } else {
                sectionId = "other";
            }

            const section = document.getElementById(sectionId);
            if (section) {
                // Create a container for images if not already present
                let imageContainer = section.querySelector(".gallery-images");
                if (!imageContainer) {
                    imageContainer = document.createElement("div");
                    imageContainer.classList.add("gallery-images");
                    section.appendChild(imageContainer);
                }

                // Append the images to the container
                entry.photos.forEach(photo => {
                    const img = createImageElement(`images/${photo}`, `${entry.pictureKind} - ${photo}`);
                    imageContainer.appendChild(img);
                });
            }
        });
    } catch (error) {
        console.error("Failed to load gallery:", error);
    }
};

// Load the gallery after DOM content is loaded
document.addEventListener("DOMContentLoaded", loadGallery);
