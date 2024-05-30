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
  
    try {
      const data = await fetchCurrencyData(sendCurrency);
  
 
  
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
  