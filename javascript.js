document.addEventListener("DOMContentLoaded", function() {
  // see http://ip-api.com/docs/api:json for documentation

  // API to Get country and country code
  var endpoint = 'http://ip-api.com/json/?fields=status,message,country,countryCode';

  var xhr = new XMLHttpRequest();
  xhr.onreadystatechange = function() {
      if (this.readyState == 4 && this.status == 200) {
          var response = JSON.parse(this.responseText);
          if(response.status !== 'success') {
              console.log('query failed: ' + response.message);
              return;
          }
          // Display country and country code in HTML
          document.getElementById('country').innerText = response.country;
          document.getElementById('cc').innerText = response.countryCode;

          // Get the currency corresponding to the country code
          var countryCode = response.countryCode;
          var currencyCode = getCurrencyCodeByCountryCode(countryCode);

          // Move the currency to the top of the select list
          if (currencyCode) {
              moveCurrencyToTop(currencyCode);
          }
      }
  };
  xhr.open('GET', endpoint, true);
  xhr.send();

  // Function to get currency code by country code
  function getCurrencyCodeByCountryCode(countryCode) {
      // Define a mapping of country codes to currency codes
      var currencyMapping = {
          'US': 'USD',
          'CA': 'CAD',
          'GB': 'GBP',
          'EU': 'EUR',
          'NG': 'NGN',

          // Add more country code to currency code mappings as needed
          // ...
      };

      return currencyMapping[countryCode] || null;
  }

  // Function to move the specified currency to the top of the select list
  function moveCurrencyToTop(currencyCode) {
      var select = document.getElementById('send-currency');
      var options = Array.from(select.options);
      var currencyOption = options.find(option => option.value === currencyCode);

      if (currencyOption) {
          select.removeChild(currencyOption);
          select.insertBefore(currencyOption, select.firstChild);
      }
  }
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
      document.getElementById("rate").innerText = receiveCurrencyRate;
  
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