const fetch = require('node-fetch');

//const { CLIENT_ID, APP_SECRET } = process.env;
const CLIENT_ID = 'Af0PxoOme46Pcp7Q3TMlx9oC68UYUywKd9FIBKzicr0MUuOD8jfrQFQTDQPh6D1BdEViZd8Rgd010iFF';
const APP_SECRET = 'EAGNGUYyg6Wi0xSTsynvGYLTnCJtO_HTJB4DPgjlAWlHrc3wDNEJfK58Jr56Si3uRKgzdQsOknBEuoIn';
const base = "https://api-m.sandbox.paypal.com";

const paypalRepository = require('./paypalRepository');

var addAmount;

exports.changeAmount = (addBudget) =>{
    addAmount = addBudget;
}

exports.complete = async (userID) =>{
    idBill = parseInt(await paypalRepository.countHistory())+1;
    const result = await paypalRepository.insertHistoryandChangeBudget(idBill, userID, parseInt(addAmount/0.000042));
    addAmount = 0;
    return result;
}

generateAccessToken = async () => {
  const response = await fetch(base + "/v1/oauth2/token", {
    method: "post",
    body: "grant_type=client_credentials",
    headers: {
      Authorization:
        "Basic " + Buffer.from(CLIENT_ID + ":" + APP_SECRET).toString("base64"),
    },
  });
  const data = await response.json();
  return data.access_token;
}

exports.createOrder = async() => {
  const accessToken = await generateAccessToken();
  const url = `${base}/v2/checkout/orders`;
  const response = await fetch(url, {
    method: "post",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify({
      intent: "CAPTURE",
      purchase_units: [
        {
          amount: {
            currency_code: "USD",
            value: addAmount.toString(),
          },
        },
      ],
    }),
  });
  const data = await response.json();
  console.log(data);
  return data;
}

exports.capturePayment = async(orderId) => {
  const accessToken = await generateAccessToken();
  const url = `${base}/v2/checkout/orders/${orderId}/capture`;
  const response = await fetch(url, {
    method: "post",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
  });
  const data = await response.json();
  console.log(data);
  return data;
}