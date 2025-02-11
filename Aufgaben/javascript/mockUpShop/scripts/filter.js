// Event Listener für Kategorieauswahl und Filteranwendung
document.getElementById("category").addEventListener("change", updateFilters);
document.getElementById("applyFilters").addEventListener("click", applyFilters);

// Immer verfügbare Basisfilter
const baseFilters = `
    <label for="min-price">Min. Preis (CHF):</label>
    <input type="number" id="min-price" placeholder="z.B. 100" />
    <label for="max-price">Max. Preis (CHF):</label>
    <input type="number" id="max-price" placeholder="z.B. 5000" />
    <label for="brand">Marke:</label>
    <input type="text" id="brand" placeholder="Marke eingeben" />
`;

// Funktion zur Aktualisierung der dynamischen Filter basierend auf der Kategorie
function updateFilters() {
  const category = document.getElementById("category").value;
  const filterContainer = document.getElementById("dynamic-filters");
  filterContainer.innerHTML = baseFilters;

  let categoryFilters = "";
  switch (category) {
    case "Kameras":
      categoryFilters = `
                <label for="min-resolution">Min. Auflösung (MP):</label>
                <input type="number" id="min-resolution" placeholder="z.B. 24" />
                <label for="sensor">Sensorgrösse:</label>
                <select id="sensor">
                    <option value="all">Alle</option>
                    <option value="Full-Frame">Full-Frame</option>
                    <option value="APS-C">APS-C</option>
                    <option value="Micro Four Thirds">Micro Four Thirds</option>
                </select>
                <label for="video-resolution">Videoauflösung:</label>
                <select id="video-resolution">
                    <option value="all">Alle</option>
                    <option value="4K">4K</option>
                    <option value="8K">8K</option>
                </select>
                <label for="iso-range">ISO-Bereich:</label>
                <input type="text" id="iso-range" placeholder="z.B. 100-51200" />
                <label for="max-weight">Max. Gewicht (g):</label>
                <input type="number" id="max-weight" placeholder="Max Gewicht" />
            `;
      break;

    case "Objektive":
      categoryFilters = `
                <label for="focal-length">Brennweite:</label>
                <input type="text" id="focal-length" placeholder="z.B. 24-70mm" />
                <label for="max-aperture">Maximale Blende:</label>
                <input type="text" id="max-aperture" placeholder="z.B. f/2.8" />
                <label for="filter-size">Filterdurchmesser (mm):</label>
                <input type="number" id="filter-size" placeholder="z.B. 77" />
                <label for="compatibility">Kompatibilität:</label>
                <input type="text" id="compatibility" placeholder="z.B. Sony E-Mount" />
            `;
      break;

    case "Drohnen":
      categoryFilters = `
                <label for="flight-time">Min. Flugzeit (Minuten):</label>
                <input type="number" id="flight-time" placeholder="z.B. 20" />
                <label for="range">Min. Reichweite (km):</label>
                <input type="number" id="range" placeholder="z.B. 10" />
                <label for="camera-resolution">Kameraauflösung:</label>
                <input type="text" id="camera-resolution" placeholder="z.B. 4K" />
                <label for="features">Features:</label>
                <input type="text" id="features" placeholder="z.B. Hinderniserkennung" />
            `;
      break;
    default:
      console.log("no filter found: " + category);
      break;
  }

  filterContainer.innerHTML += categoryFilters;
}

// Funktion zur Anwendung der Filter
function applyFilters() {
  const category = document.getElementById("category").value;
  const minPrice = parseFloat(document.getElementById("min-price")?.value) || 0;
  const maxPrice =
    parseFloat(document.getElementById("max-price")?.value) || Infinity;
  const brand = document.getElementById("brand")?.value.toLowerCase() || "";

  fetch("json/inventory.json")
    .then((response) => response.json())
    .then((products) => {
      let filteredProducts = products.filter((product) => {
        const isCategoryMatch =
          category === "all" || product.kategorie === category;
        const isPriceMatch =
          product.preis >= minPrice && product.preis <= maxPrice;
        const isBrandMatch =
          !brand || product.produktname.toLowerCase().includes(brand); // Marke im Namen suchen

        let isProductMatch = true;
        if (category === "Kameras") {
          const minResolution =
            parseFloat(document.getElementById("min-resolution")?.value) || 0;
          const sensor = document.getElementById("sensor")?.value || "all";
          const videoResolution =
            document.getElementById("video-resolution")?.value || "all";
          const isoRange = document.getElementById("iso-range")?.value || "";
          const maxWeight =
            parseFloat(document.getElementById("max-weight")?.value) ||
            Infinity;

          if (minResolution > 0) {
            isProductMatch =
              isProductMatch &&
              parseFloat(product.TechnischeDaten?.sensor?.split(" ")[0]) >=
              minResolution;
          }
          if (sensor !== "all") {
            isProductMatch =
              isProductMatch &&
              product.TechnischeDaten?.sensor?.includes(sensor);
          }
          if (videoResolution !== "all") {
            isProductMatch =
              isProductMatch &&
              product.TechnischeDaten?.video?.includes(videoResolution);
          }
          if (
            isoRange &&
            !product.TechnischeDaten?.iso_bereich?.includes(isoRange)
          ) {
            isProductMatch = false;
          }
          if (
            maxWeight !== Infinity &&
            product.TechnischeDaten?.gewicht > maxWeight
          ) {
            isProductMatch = false;
          }
        }

        if (category === "Objektive") {
          const focalLength =
            document.getElementById("focal-length")?.value || "";
          const maxAperture =
            document.getElementById("max-aperture")?.value || "";
          const filterSize =
            parseFloat(document.getElementById("filter-size")?.value) || 0;
          const compatibility =
            document.getElementById("compatibility")?.value || "";

          isProductMatch =
            (!focalLength ||
              product.TechnischeDaten?.brennweite?.includes(focalLength)) &&
            (!maxAperture || product.TechnischeDaten?.blende === maxAperture) &&
            (!filterSize ||
              product.TechnischeDaten?.filterdurchmesser ===
              `${filterSize}mm`) &&
            (!compatibility ||
              product.TechnischeDaten?.kompatibilität?.includes(compatibility));
        }

        if (category === "Drohnen") {
          const flightTime =
            parseFloat(document.getElementById("flight-time")?.value) || 0;
          const range =
            parseFloat(document.getElementById("range")?.value) || 0;
          const cameraResolution =
            document.getElementById("camera-resolution")?.value || "";
          const features =
            document.getElementById("features")?.value.toLowerCase() || "";

          isProductMatch =
            (flightTime === 0 ||
              product.TechnischeDaten?.flugzeit >= flightTime) &&
            (range === 0 || product.TechnischeDaten?.reichweite >= range) &&
            (!cameraResolution ||
              product.TechnischeDaten?.kamera?.includes(cameraResolution)) &&
            (!features ||
              Object.values(product.TechnischeDaten).some((val) =>
                val.toLowerCase().includes(features)
              ));
        }

        return (
          isCategoryMatch && isPriceMatch && isBrandMatch && isProductMatch
        );
      });

      renderProducts(filteredProducts);
      showPopup("Filter wurden geladen");
    })
    .catch((error) => {
      console.error("Fehler beim Filtern:", error);
    });
}

// Funktion zum Anzeigen der gefilterten Produkte
function renderProducts(products) {
  const container = document.getElementById("card-container");
  container.innerHTML = ""; // Vorherige Karten löschen

  if (products.length === 0) {
    container.innerHTML = "<p>Keine Produkte gefunden.</p>";
    return;
  }

  products.forEach((product) => {
    createCard(
      product.produktname,
      product.beschreibung,
      product.bild,
      product.preis,
      product.kategorie,
      product.lagerbestand,
      product.bewertung,
      product.bewertungen,
      product.TechnischeDaten
    );
  });
}

updateFilters();