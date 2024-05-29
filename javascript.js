// Function to access the currency API
async function fetchCurrencyData(sendCurrency) {
    const url = `https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/currencies/${sendCurrency}.json`;

    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return await response.json();
    } catch (error) {
        throw new Error('Failed to fetch currency data');
    }
}

// Function to convert user-selected currencies to lowercase
function convertToLowerCase(currency) {
    return currency.toLowerCase();
}

document.getElementById("currency-form").addEventListener("submit", async function(event) {
    event.preventDefault();
    const sendAmount = parseFloat(document.getElementById("send-amount").value);
    // Convert user-selected currencies to lowercase
    const sendCurrency = convertToLowerCase(document.getElementById("send-currency").value);
    const receiveCurrency = convertToLowerCase(document.getElementById("receive-currency").value);

    try {
        const data = await fetchCurrencyData(sendCurrency);

        // Check if receiveCurrency exists in the response
        if (receiveCurrency in data) {
            // Extract conversion rate for the receive currency
            const receiveCurrencyRate = data[receiveCurrency];
            console.log('Receive Currency Rate:', receiveCurrencyRate);

            // Calculate the received amount
            const receivedAmount = sendAmount * receiveCurrencyRate;

            // Log receivedAmount to console
            console.log('Received Amount:', receivedAmount);

            // Display the result in the receive-amount input
            document.getElementById("result").value = receivedAmount.toFixed(2);
        } else {
            throw new Error('Receive currency not found in response');
        }

    } catch (error) {
        console.error(error);
        // Handle the error
        alert("Failed to perform currency conversion. Please try again later.");
    }
});
