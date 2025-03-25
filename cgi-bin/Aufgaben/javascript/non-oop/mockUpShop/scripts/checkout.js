document.addEventListener("DOMContentLoaded", () => {
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    const totalAmount = localStorage.getItem("gesamtbetrag") || "0.00";
    const invoiceContainer = document.getElementById("invoice");

    // Vorherige Formulardaten laden
    document.getElementById("firstname").value = localStorage.getItem("firstname") || "";
    document.getElementById("lastname").value = localStorage.getItem("lastname") || "";
    document.getElementById("email").value = localStorage.getItem("email") || "";
    document.getElementById("phone").value = localStorage.getItem("phone") || "";
    document.getElementById("street").value = localStorage.getItem("street") || "";
    document.getElementById("number").value = localStorage.getItem("number") || "";
    document.getElementById("zipcode").value = localStorage.getItem("zipcode") || "";
    document.getElementById("city").value = localStorage.getItem("city") || "";

    // Gruppierung der Produkte im Warenkorb
    function groupCartItems(cart) {
        return cart.reduce((groupedItems, item) => {
            const key = item.produktname;
            if (!groupedItems[key]) {
                groupedItems[key] = { ...item, quantity: 0 };
            }
            groupedItems[key].quantity += item.quantity || 1;
            return groupedItems;
        }, {});
    }

    // Faktura-Generierung
    function generateInvoice() {
        if (cart.length === 0) {
            invoiceContainer.innerHTML = "<p>Ihr Warenkorb ist leer!</p>";
            return;
        }

        const groupedCart = groupCartItems(cart);

        let invoiceText = "<h3>Faktura</h3><ul>";
        Object.values(groupedCart).forEach(item => {
            invoiceText += `
                <li>
                    <strong>${item.produktname}</strong>: CHF ${item.price.toFixed(2)} 
                    (Menge: ${item.quantity})
                </li>
            `;
        });
        invoiceText += `</ul><p><strong>Gesamtbetrag: CHF ${totalAmount}</strong></p>`;
        invoiceContainer.innerHTML = invoiceText;
    }

    // Faktura anzeigen
    generateInvoice();

    // Bestellformular-Absenden
    document.getElementById("submit-order").addEventListener("click", () => {
        const prefixName = (() => {
            const selectedAnrede = document.querySelector('input[name="anrede"]:checked').value;

            if (selectedAnrede === "Andere") {
                const customAnrede = document.getElementById("custom-anrede").value.trim();
                return customAnrede || "Andere"; // Return custom value or "Andere" if nothing is entered
            }

            // Ensure it's either Herr or Frau
            return selectedAnrede === "Herr" || selectedAnrede === "Frau" ? selectedAnrede : "Andere";
        })();
        const firstName = document.getElementById("firstname").value.trim();
        const lastName = document.getElementById("lastname").value.trim();
        const email = document.getElementById("email").value.trim();
        const phone = document.getElementById("phone").value.trim();
        const street = document.getElementById("street").value.trim();
        const number = document.getElementById("number").value.trim();
        const zipcode = document.getElementById("zipcode").value.trim();
        const city = document.getElementById("city").value.trim();
        const paymentMethod = document.querySelector('input[name="payment-method"]:checked')?.value;
        const deliveryOption = document.querySelector('input[name="delivery-option"]:checked')?.value;
        const orderNumber = Math.floor(10000 + Math.random() * 90000);

        // Überprüfung, ob alle Felder ausgefüllt sind
        if (!firstName || !lastName || !email || !phone || !street || !number || !zipcode || !city || !paymentMethod || !deliveryOption) {
            showPopup("Bitte füllen Sie alle Felder aus.");
            return;
        }

        const groupedCart = groupCartItems(cart);


        let paymentInstructions = "";
        switch (paymentMethod) {
            case "TWINT":
                paymentInstructions = `Bitte begleichen Sie den Betrag von CHF ${totalAmount} via TWINT an die folgende Nummer: +41 76 306 72 03`;
                break;
            case "Bar/Kreditkarte":
                paymentInstructions = `Bitte stellen Sie sicher, dass der Betrag von CHF ${totalAmount} bei der Abholung in bar oder per Kreditkarte beglichen werden kann.`;
                break;
            case "Rechnung":
                paymentInstructions = `Sie erhalten eine Rechnung mit 30 Tagen Zahlfrist. Wir gewähren 1% Skonto, wenn die Zahlung innerhalb von 3 Tagen erfolgt.`;
                break;
            default:
                paymentInstructions = "Keine spezifischen Zahlungsanweisungen verfügbar.";
        }

        const orderSummary = `
Guten Tag ${prefixName} ${firstName} ${lastName},

Vielen Dank für Ihre Bestellung bei Photofuel.tech! Hier sind die Details Ihrer Bestellung:

Bestellnummer: ${orderNumber}
Name: ${prefixName} ${firstName} ${lastName}
E-Mail: ${email}
Lieferoption: ${deliveryOption}
Zahlungsmethode: ${paymentMethod}

Gesamtbetrag: CHF ${totalAmount}

Produkte:
${Object.values(groupedCart)
                .map(item => `- ${item.produktname} (CHF ${item.price.toFixed(2)}, Menge: ${item.quantity})`)
                .join("\n")}

Zahlungsanweisungen:
${paymentInstructions}

Vielen Dank für Ihre Bestellung! Bei weiteren Fragen stehen wir Ihnen gerne zur Verfügung.

Mit freundlichen Grüßen,  
Ihr Photofuel.tech Team
        `;

        const mailtoLink = `mailto:${email}?subject=Bestellung%20${orderNumber}&body=${encodeURIComponent(orderSummary)}`;

        window.location.href = mailtoLink;
        localStorage.removeItem("cart");
        showPopup("Bestellung wurde erfolgreich abgeschlossen");

        // Nach Bestellung fragen, ob Daten gespeichert werden sollen
        if (confirm("Möchten Sie Ihre Daten für zukünftige Bestellungen speichern?")) {
            localStorage.setItem("firstname", firstName);
            localStorage.setItem("lastname", lastName);
            localStorage.setItem("email", email);
            localStorage.setItem("phone", phone);
            localStorage.setItem("street", street);
            localStorage.setItem("number", number);
            localStorage.setItem("zipcode", zipcode);
            localStorage.setItem("city", city);
            localStorage.setItem("autofillEnabled", "true");

            showPopup("Daten wurden gespeichert")
        }

        setTimeout(() => {
            window.location.href = "index.html";
        }, 1000);
    });
});
