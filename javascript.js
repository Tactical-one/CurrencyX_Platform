/**
 * Fetches IP details from the API and updates the HTML elements with the retrieved data.
 */
async function fetchIPDetails() {
    const apiUrl = 'https://api.myip.com';
    const ipElement = document.getElementById('ip');
    const countryElement = document.getElementById('country');
    const ccElement = document.getElementById('cc');

    try {
        const response = await fetch(apiUrl);

        if (!response.ok) {
            throw new Error(`Network response was not ok: ${response.statusText}`);
        }

        const data = await response.json();

        ipElement.textContent = data.ip;
        countryElement.textContent = `${data.country}`;
        ccElement.textContent = data.cc;
    } catch (error) {
        console.error('Error fetching IP details:', error);
        ipElement.textContent = `Error: ${error.message}`;
        countryElement.textContent = 'Error';
        ccElement.textContent = '';
    }
}

window.addEventListener('load', fetchIPDetails);



/**
 * Fetches currency conversion details from the API and updates the HTML elements with the retrieved data.
 */
function executeConversion() {
    const sendAmount = document.getElementById('send-amount').value;
    const sendCurrency = document.getElementById('send-currency').value;
    const receiveCurrency = document.getElementById('receive-currency').value;

    if (sendAmount === "" || isNaN(sendAmount)) {
        alert("Please enter a valid amount to send.");
        return;
    }

    const endpoint = 'convert';
    const access_key = '1d46c82454c45074f6bc05d5b57e78fa';

    const from = sendCurrency;
    const to = receiveCurrency;
    const amount = sendAmount;

    $.ajax({
        url: `http://api.exchangerate.host/${endpoint}?access_key=${access_key}&from=${from}&to=${to}&amount=${amount}`,
        dataType: 'jsonp',
        success: function(json) {
            if (!json.result) {
                alert("Failed to get a valid response from the exchange rate service.");
                return;
            }
            const receivedAmount = json.result.toFixed(2);
            const rate = json.info.rate;
            const timestamp = new Date(json.info.timestamp * 1000).toLocaleTimeString();

            $('#result').val(receivedAmount);
            $('#result1').text(rate);
            $('#time').text(timestamp);
        },
        error: function(jqXHR, textStatus, errorThrown) {
            alert(`An error occurred while fetching exchange rate data: ${textStatus}, ${errorThrown}`);
        }
    });
}