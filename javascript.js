document.addEventListener("DOMContentLoaded", function() {
  function fetchIPInfo() {
    // Make a GET request to the API
    fetch('https://api.myip.com')
        .then(response => response.json())
        .then(data => {
            // Find the divs for IP info and set their text content
            document.getElementById("ip-address").textContent = `IP: ${data.ip}`;
            document.getElementById("country").textContent = `Country: ${data.country}`;
            document.getElementById("country-code").textContent = `Country Code: ${data.cc}`;
        })
        .catch(error => {
            console.error('Error fetching IP info:', error);
        });
}

// Call the functions to display the random number, current date, and IP info when the DOM is fully loaded
fetchIPInfo();
});








/**
 * Fetches currency data from the API
 * @param {string} sendCurrency - The currency to fetch data for
 * @returns {Promise<object>} - The fetched currency data
 */
async function fetchCurrencyData(sendCurrency) {
    const url = `https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/currencies/${sendCurrency}.json`;
  
    try {
      // Fetch the currency data from the API
      const response = await fetch(url);
      if (!response.ok) {
        // Throw an error if the response is not OK
        throw new Error('Network response was not ok');
      }
      // Parse the response as JSON
      let finalData = await response.json();
      return finalData;
    } catch (error) {
      // Log the error and rethrow it for handling in the calling function
      console.error('Failed to fetch currency data:', error);
      throw error;
    }
  }
  
  // Event listener for the currency conversion form submission
    document.getElementById("currency-form").addEventListener("submit", async function(event) {
    event.preventDefault();
    const sendAmount = parseFloat(document.getElementById("send-amount").value);
    const sendCurrency = convertToLowerCase(document.getElementById("send-currency").value);
    const receiveCurrency = convertToLowerCase(document.getElementById("receive-currency").value);

     // Function to convert currencies in dropdown to lowercase
  function convertToLowerCase(currency) {
    return currency.toLowerCase();
  }
  
    try {
      const data = await fetchCurrencyData(sendCurrency);
  
      // Access the conversion rate for the receive currency directly
      const receiveCurrencyRate = (data[sendCurrency][receiveCurrency]);
  
      // Validate the conversion rate
      if (typeof receiveCurrencyRate !== 'number' || isNaN(receiveCurrencyRate)) {
        throw new Error('Invalid conversion rate');
      }
  
      // Perform the currency conversion
      const receivedAmount = sendAmount * receiveCurrencyRate;
  
      // Update the result in the 'result' input field
      document.getElementById("result").value = receivedAmount.toFixed(2);
    } catch (error) {
      alert("Failed to perform currency conversion. Please try again later.");
    }
  });
  
  //The modal function
  document.getElementById('payButton').addEventListener('click', function() {
    const form = document.getElementById('paymentForm');
    if (form.checkValidity()) {
        alert('Payment processed successfully!');
        $('#paymentModal').modal('hide');
        setTimeout(function() {
            window.location.href = 'invoice.html'; // Redirect to your desired page
        }, 1000); // Adjust the timeout as needed
    } else {
        form.reportValidity();
    }
});