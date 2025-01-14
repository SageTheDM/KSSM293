document.addEventListener('DOMContentLoaded', () => {
    const cartContainer = document.getElementById('cart-container');
    const totalPriceElement = document.getElementById('total-price');

    // Get the cart from localStorage
    let cart = JSON.parse(localStorage.getItem('cart')) || [];

    // Check if the cart is empty
    if (cart.length === 0) {
        cartContainer.innerHTML = '<p>Ihr Warenkorb ist leer!</p>';
        totalPriceElement.textContent = 'Gesamt: CHF 0';
        return;
    }

    // Calculate and display the total price
    function updateTotalPrice() {
        let totalPrice = 0;
        cart.forEach(item => {
            const itemPrice = parseFloat(item.price.replace('CHF', '').trim());
            totalPrice += itemPrice * item.quantity;  // Multiply by quantity
        });
        totalPriceElement.textContent = `Gesamt: CHF ${totalPrice.toFixed(2)}`;
    }

    // Group items by product name and calculate quantities
    const itemQuantities = cart.reduce((acc, item) => {
        const itemKey = item.produktname;  // Use product name as the key
        if (!acc[itemKey]) {
            acc[itemKey] = { ...item, quantity: 0 };
        }
        acc[itemKey].quantity += 1;  // Increase quantity for each occurrence of the item
        return acc;
    }, {});

    // Loop through the unique items and display them
    Object.values(itemQuantities).forEach(item => {
        const itemElement = document.createElement('div');
        itemElement.className = 'cart-item';

        const itemImage = document.createElement('img');
        itemImage.src = item.image;
        itemImage.alt = item.produktname;
        itemImage.className = 'cart-item-image';

        const itemDetails = document.createElement('div');
        itemDetails.className = 'cart-item-details';

        const itemName = document.createElement('h3');
        itemName.textContent = item.produktname;

        // Display price as it is stored (with CHF)
        const itemPrice = document.createElement('p');
        itemPrice.textContent = `CHF ${item.price}`;

        const itemQuantity = document.createElement('p');
        itemQuantity.textContent = `Quantity: ${item.quantity}`;

        const itemRemoveButton = document.createElement('button');
        itemRemoveButton.className = 'remove-item';
        itemRemoveButton.textContent = 'Entfernen';
        itemRemoveButton.addEventListener('click', () => removeItemFromCart(item.produktname, itemElement));

        // Add item details and remove button
        itemDetails.appendChild(itemName);
        itemDetails.appendChild(itemPrice);
        itemDetails.appendChild(itemQuantity);
        itemDetails.appendChild(itemRemoveButton);

        itemElement.appendChild(itemImage);
        itemElement.appendChild(itemDetails);
        cartContainer.appendChild(itemElement);
    });

    // Remove item from cart
    function removeItemFromCart(itemName, itemElement) {
        // Find the item in the cart and decrease the quantity
        const itemIndex = cart.findIndex(item => item.produktname === itemName);
        if (itemIndex > -1) {
            const item = cart[itemIndex];
            item.quantity -= 1;
            if (item.quantity <= 0) {
                cart.splice(itemIndex, 1);  // Remove the item if quantity is zero
            }
        }

    // Update localStorage
        localStorage.setItem('cart', JSON.stringify(cart));

        // Remove the item element from the DOM
        itemElement.remove();

        // If the cart is empty, display a message
        if (cart.length === 0) {
            cartContainer.innerHTML = '<p>Ihr Warenkorb ist leer!</p>';
        }

        // Recalculate and update the total price
        updateTotalPrice();
    }

    // Initial update of the total price
    updateTotalPrice();
});
