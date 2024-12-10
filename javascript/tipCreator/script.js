const calculateAmount = (tip, amount) => amount + amount / 100 * tip;

function generateBill() {
    const amount = parseFloat(document.getElementById('amount').value);
    const low = parseFloat(document.getElementById('low').value);
    const high = parseFloat(document.getElementById('high').value);
    let tip = 0;

    if (amount >= low && amount <= high) {
        tip = parseFloat(document.getElementById('tipInRange').value);
    } else {
        tip = parseFloat(document.getElementById('otherTip').value);
    }

    const totalAmount = calculateAmount(tip, amount);
    const tipAsPercentage = tip;
    const tipAsCurrency = (amount / 100) * tip;
    const amountBeforeTip = amount;

    // Get the custom currency symbol
    const currencySymbol = document.getElementById('currencySymbol').value;

    // Generate the div as a bill
    const billContainer = document.getElementById('billContainer');
    billContainer.innerHTML = `
        <div class="bill">
            <h2>Bill Summary</h2>
            <p>Amount Before Tip: ${currencySymbol} ${amountBeforeTip.toFixed(2)}</p>
            <p>Tip Percentage: ${tipAsPercentage}%</p>
            <p>Tip Amount: ${currencySymbol} ${tipAsCurrency.toFixed(2)}</p>
            <p>Total Amount: ${currencySymbol} ${totalAmount.toFixed(2)}</p>
        </div>
    `;
}