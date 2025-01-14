document.addEventListener('DOMContentLoaded', () => {
    const cartContainer = document.getElementById('cart-container');
    const totalPriceElement = document.getElementById('total-price');

    // Fetch the cart from localStorage once
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    console.log("Initial cart data:", cart);

    // Function to update the total price
    function updateTotalPrice() {
        const totalPrice = cart.reduce((total, item) => {
            return total + parseFloat(item.price || 0) * (item.quantity || 1);
        }, 0);
        totalPriceElement.textContent = `Gesamt: CHF ${totalPrice.toFixed(2)}`;
        console.log("Updated total price:", totalPrice);
    }

    // Function to render the cart
    function renderCart() {
        // Clear existing content
        cartContainer.innerHTML = "";

        // If cart is empty, show message and return
        if (cart.length === 0) {
            cartContainer.innerHTML = '<p>Ihr Warenkorb ist leer!</p>';
            totalPriceElement.textContent = 'Gesamt: CHF 0';
            return;
        }

        // Group items by name
        const groupedCart = cart.reduce((acc, item) => {
            const key = item.produktname;
            if (!acc[key]) {
                acc[key] = { ...item, quantity: 0 };
            }
            acc[key].quantity += 1;
            return acc;
        }, {});

        // Create elements for each item
        Object.values(groupedCart).forEach(item => {
            const itemElement = document.createElement('div');
            itemElement.className = 'cart-item';

            const itemImage = document.createElement('img');
            itemImage.src = item.image || "";
            itemImage.alt = item.produktname || "Item";
            itemImage.className = 'cart-item-image';

            const itemDetails = document.createElement('div');
            itemDetails.className = 'cart-item-details';

            const itemName = document.createElement('h3');
            itemName.textContent = item.produktname;

            const itemPrice = document.createElement('p');
            itemPrice.textContent = `CHF ${item.price}`;

            const itemQuantity = document.createElement('p');
            itemQuantity.textContent = `Quantity: ${item.quantity}`;

            const removeButton = document.createElement('button');
            removeButton.textContent = 'Entfernen';
            removeButton.className = 'remove-item';
            removeButton.addEventListener('click', () => {
                removeItem(item.produktname);
            });

            // Append details
            itemDetails.appendChild(itemName);
            itemDetails.appendChild(itemPrice);
            itemDetails.appendChild(itemQuantity);
            itemDetails.appendChild(removeButton);

            itemElement.appendChild(itemImage);
            itemElement.appendChild(itemDetails);
            cartContainer.appendChild(itemElement);
        });
    }

    // Function to remove an item
    function removeItem(itemName) {
        cart = cart.filter(item => item.produktname !== itemName);
        localStorage.setItem('cart', JSON.stringify(cart)); // Update storage
        console.log("Item removed, new cart:", cart);
        renderCart(); // Re-render cart
        updateTotalPrice(); // Update total price
    }

    // Initial render
    renderCart();
    updateTotalPrice();
});
