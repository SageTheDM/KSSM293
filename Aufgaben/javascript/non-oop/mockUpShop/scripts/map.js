function initMap() {
    // Koordinaten für Hauptsitz und Nebensitz
    const locations = {
        hauptsitz: [47.044287, 9.440292], // Kantonsschule Sargans
        nebensitz: [46.899024, 9.564224]   // Trimmis
    };

    let currentLocation = locations.hauptsitz;

    // Initialisiere die Karte mit Leaflet.js
    const map = L.map('map').setView(currentLocation, 12);

    // OpenStreetMap Tile Layer hinzufügen
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors'
    }).addTo(map);

    // Marker hinzufügen
    let marker = L.marker(currentLocation).addTo(map);

    // Suchfeld-Event-Listener
    document.getElementById("search-box").addEventListener("change", function () {
        const query = this.value;
        fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${query}`)
            .then(response => response.json())
            .then(data => {
                if (data.length > 0) {
                    const newLocation = [parseFloat(data[0].lat), parseFloat(data[0].lon)];
                    map.setView(newLocation, 12);
                    marker.setLatLng(newLocation);
                }
            });
    });

    // Event-Listener für "Open in Google Maps" (für OpenStreetMap Link angepasst)
    document.getElementById("open-in-open-street-map").addEventListener("click", () => {
        window.open(`https://www.openstreetmap.org/?mlat=${currentLocation[0]}&mlon=${currentLocation[1]}&zoom=12`);
    });

    // Dropdown-Event-Listener
    document.getElementById("location-select").addEventListener("change", (event) => {
        const selectedLocation = event.target.value;
        currentLocation = locations[selectedLocation];
        map.setView(currentLocation, 12);
        marker.setLatLng(currentLocation);
    });
}

initMap();