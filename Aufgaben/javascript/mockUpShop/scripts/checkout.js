document.addEventListener("DOMContentLoaded", () => {
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    const gesamtbetrag = localStorage.getItem("gesamtbetrag") || "0.00";
    const invoiceContainer = document.getElementById("invoice");

    // Gruppierung der Produkte im Warenkorb
    function groupCartItems(cart) {
        return cart.reduce((acc, item) => {
            const key = item.produktname;
            if (!acc[key]) {
                acc[key] = { ...item, quantity: 0 };
            }
            acc[key].quantity += item.quantity || 1;
            return acc;
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
        invoiceText += `</ul><p><strong>Gesamtbetrag: CHF ${gesamtbetrag}</strong></p>`;
        invoiceContainer.innerHTML = invoiceText;
    }

    // Faktura anzeigen
    generateInvoice();

    // Wenn Bar/Kreditkarte ausgewählt wird, automatisch Abholung auswählen und Lieferung deaktivieren
    document.querySelectorAll('input[name="payment-method"]').forEach(paymentOption => {
        paymentOption.addEventListener("change", () => {
            const deliveryOption = document.querySelector('input[name="delivery-option"][value="Abholung"]');
            const deliveryOptionRadio = document.querySelector('input[name="delivery-option"][value="Lieferung"]');
            if (paymentOption.value === "Bar/Kreditkarte") {
                if (deliveryOption) deliveryOption.checked = true;
                if (deliveryOptionRadio) deliveryOptionRadio.disabled = true;
            } else {
                if (deliveryOptionRadio) deliveryOptionRadio.disabled = false;
            }
        });
    });

    // Bestellformular-Absenden
    document.getElementById("submit-order").addEventListener("click", () => {
        const firstName = document.getElementById("firstname").value.trim();
        const lastName = document.getElementById("lastname").value.trim();
        const email = document.getElementById("email").value.trim();
        const deliveryOption = document.querySelector('input[name="delivery-option"]:checked')?.value;
        const paymentMethod = document.querySelector('input[name="payment-method"]:checked')?.value;
        const orderNumber = Math.floor(10000 + Math.random() * 90000);

        const anrede = document.querySelector('input[name="anrede"]:checked')?.value || "";
        const customAnrede = document.getElementById("custom-anrede").value.trim();
        const fullAnrede = customAnrede || anrede;

        // Überprüfung, ob alle Felder ausgefüllt sind
        if (!firstName || !lastName || !email || !deliveryOption || !paymentMethod) {
            alert("Bitte füllen Sie alle Felder aus.");
            return;
        }

        const groupedCart = groupCartItems(cart);

        // Payment instructions based on the selected method
        let paymentInstructions = "";
        switch (paymentMethod) {
            case "TWINT":
                paymentInstructions = `
Bitte begleichen Sie den Betrag von CHF ${gesamtbetrag} via TWINT an die folgende Nummer:
+41 76 306 72 03`;
                break;
            case "Bar/Kreditkarte":
                paymentInstructions = `
Bitte stellen Sie sicher, dass der Betrag von CHF ${gesamtbetrag} bei der Abholung in bar oder per Kreditkarte beglichen werden kann.`;
                break;
            case "Rechnung":
                paymentInstructions = `
Sie erhalten eine Rechnung mit 30 Tagen Zahlfrist. Wir gewähren 1% Skonto, wenn die Zahlung innerhalb von 3 Tagen erfolgt.`;
                break;
            default:
                paymentInstructions = "Keine spezifischen Zahlungsanweisungen verfügbar.";
        }

        const orderSummary = `
Guten Tag ${fullAnrede} ${firstName} ${lastName},

Vielen Dank für Ihre Bestellung bei Photofuel.tech! Hier sind die Details Ihrer Bestellung:

Bestellnummer: ${orderNumber}
Name: ${fullAnrede} ${firstName} ${lastName}
E-Mail: ${email}
Lieferoption: ${deliveryOption}
Zahlungsmethode: ${paymentMethod}

Gesamtbetrag: CHF ${gesamtbetrag}

Produkte:
${Object.values(groupedCart)
                .map(item => `- ${item.produktname} (CHF ${item.price.toFixed(2)}, Menge: ${item.quantity})`)
                .join("\n")}

Zahlungsanweisungen:
${paymentInstructions}

Vielen Dank für Ihre Bestellung! Bei weiteren Fragen stehen wir Ihnen gerne zur Verfügung.

Mit freundlichen Grüssen,  
Ihr Photofuel.tech Team
        `;

        const mailtoLink = `mailto:info@photofuel.tech?subject=Bestellung%20${orderNumber}&body=${encodeURIComponent(orderSummary)}`;

        // Open the mailto link in the email client
        window.location.href = mailtoLink;
        localStorage.removeItem("cart");
        alert("Bestellung wurde erfolgreich abgeschlossen");

        // Delay redirect to allow mailto to process
        setTimeout(() => {
            window.location.href = "index.html";
        }, 1000);

    });
});
