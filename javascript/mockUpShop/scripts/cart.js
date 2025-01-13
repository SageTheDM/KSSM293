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
            totalPrice += parseFloat(item.price);
        });
        totalPriceElement.textContent = `Gesamt: CHF ${totalPrice.toFixed(2)}`;
    }

    // Loop through the cart items and display them
    cart.forEach(item => {
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

        const itemPrice = document.createElement('p');
        itemPrice.textContent = `CHF ${item.price}`;

        // Add item details to itemElement
        itemDetails.appendChild(itemName);
        itemDetails.appendChild(itemPrice);

        const itemRemoveButton = document.createElement('button');
        itemRemoveButton.className = 'remove-item';
        itemRemoveButton.textContent = 'Entfernen';
        itemRemoveButton.addEventListener('click', () => removeItemFromCart(item.id, itemElement));

        // Add remove button
        itemDetails.appendChild(itemRemoveButton);
        itemElement.appendChild(itemImage);
        itemElement.appendChild(itemDetails);

        cartContainer.appendChild(itemElement);
    });

    // Remove item from cart
    function removeItemFromCart(itemId, itemElement) {
        cart = cart.filter(item => item.id !== itemId);
        localStorage.setItem('cart', JSON.stringify(cart));

        // Remove the item element from the DOM without refreshing the page
        itemElement.remove();

        // Update the total price
        updateTotalPrice();

        // If cart is empty, display empty cart message
        if (cart.length === 0) {
            cartContainer.innerHTML = '<p>Ihr Warenkorb ist leer!</p>';
            totalPriceElement.textContent = 'Gesamt: CHF 0';
        }
    }

    // Initial update of the total price
    updateTotalPrice();
});
