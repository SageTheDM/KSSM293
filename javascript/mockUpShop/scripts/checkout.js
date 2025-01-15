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
            if (paymentOption.value === "Bar/Kreditkarte") {
                const deliveryOption = document.querySelector('input[name="delivery-option"][value="Abholung"]');
                const deliveryOptionRadio = document.querySelector('input[name="delivery-option"][value="Lieferung"]');
                if (deliveryOption) {
                    deliveryOption.checked = true;  // Setzt Abholung als Lieferoption
                }
                if (deliveryOptionRadio) {
                    deliveryOptionRadio.disabled = true;  // Deaktiviert die Lieferung-Option
                }
            } else {
                // Wenn eine andere Zahlungsmethode gewählt wird, Lieferung wieder aktivieren
                const deliveryOptionRadio = document.querySelector('input[name="delivery-option"][value="Lieferung"]');
                if (deliveryOptionRadio) {
                    deliveryOptionRadio.disabled = false;
                }
            }
        });
    });

    // Bestellformular-Absenden
    document.getElementById("submit-order").addEventListener("click", () => {
        const firstName = document.getElementById("firstname").value;
        const lastName = document.getElementById("lastname").value;
        const email = document.getElementById("email").value;
        const deliveryOption = document.querySelector('input[name="delivery-option"]:checked').value;
        const paymentMethod = document.querySelector('input[name="payment-method"]:checked').value;
        const orderNumber = Math.floor(10000 + Math.random() * 90000);

        // Anrede abfragen (mit optionaler benutzerdefinierter Eingabe)
        const anrede = document.querySelector('input[name="anrede"]:checked').value;
        const customAnrede = document.getElementById("custom-anrede").value;

        // Falls benutzerdefinierte Anrede eingegeben wurde, verwenden
        const fullAnrede = customAnrede ? customAnrede : anrede;

        // Überprüfung, ob alle Felder ausgefüllt sind
        if (firstName && lastName && email && deliveryOption && paymentMethod) {
            const groupedCart = groupCartItems(cart);

            const orderSummary = `
                Guten Tag ${fullAnrede} ${firstName} ${lastName},

                Wir bedanken uns herzlich bei Ihnen für die Bestellung. Die Produkte werden zeitnah bereitgestellt.

                Falls mit TWINT bezahlt wurde:
                Bitte begleichen Sie die Faktura an folgende Telefonnummer via TWINT:
                +41 76 306 72 03

                Falls Bar und/oder Karte ausgewählt ist oder Abholung:
                Sobald alle Produkte bereitgestellt sind, werden wir uns bei Ihnen melden und einen Termin vereinbaren.
                Bitte gehen Sie sicher, dass die Faktura spätestens dann beglichen werden kann, da wir Ihnen ansonsten die Ware nicht übergeben können.

                Rechnung:
                30 Tage Zahlfrist, 1% Skonto, wenn innerhalb von 3 Tagen bezahlt, und so weiter.

                Hier ist Ihre Bestellübersicht und der geschuldete Betrag:

                Bestellnummer: ${orderNumber}
                Name: ${fullAnrede} ${firstName} ${lastName}
                E-Mail: ${email}
                Lieferoption: ${deliveryOption}
                Zahlungsmethode: ${paymentMethod}
                Gesamtbetrag: CHF ${gesamtbetrag}

                Produkte:
                ${Object.values(groupedCart)
                    .map(item => `${item.produktname} (CHF ${item.price.toFixed(2)}, Menge: ${item.quantity})`)
                    .join("\n")}

                Vielen Dank für Ihre Bestellung!
            `;

            // Mailto-Link ohne HTML-Tags
            const mailtoLink = `mailto:info@photofuel.tech?subject=Bestellung%20${orderNumber}&body=${encodeURIComponent(orderSummary)}`;

            // Öffne die Mailto-Link im E-Mail-Client
            window.location.href = mailtoLink;
        } else {
            alert("Bitte füllen Sie alle Felder aus.");
        }
    });
});
