var atos = require('../src')();

var MERCHANT_ID = process.env.MERCHANT_ID;
var SECRET_KEY = process.env.SECRET_KEY;

var config = {
  mode      : 'sandbox',
  shops : [
    {
      label         : '#1',
      secretKey     : SECRET_KEY,
      merchantId    : MERCHANT_ID,
      config : {
        currencyCode  : '978',
        keyVersion    : 1
      }
    },
    {
      label         : '#2',
      secretKey     : 'key 2',
      merchantId    : '2',
      config : {
        currencyCode  : '978',
        keyVersion    : 1
      }
    }
  ]
};

var paymentData = {
  amount                : '974',
  cardNumber            : '5017670000008300',
  cardExpiryDate        : '202011',
  cardCSCValue          : '985',
  orderId               : '575acedaa8fa1f3300425001',
  transactionReference  : '97abc2paapfa1f33a00420011',
  merchantId            : MERCHANT_ID,
  customerIpAddress     : '192.168.2.101',
  invoiceReference      : '8216062410201313',
  //customerId            : '574eb5e8b7e67f7832f562fc',
  billingContact        : {
    firstname : 'foo',
    lastname  : 'bar'
  },
  billingAddress        : {
    country   : 'REU',
    addressAdditional1 : 'toto route',
    zipCode : '97400'
  },
  customerContact        : {
    firstname : 'foo',
    lastname  : 'bar'
  },
  customerAddress        : {
    country   : 'REU',
    addressAdditional1 : 'toto route',
    zipCode : '97400'
  },
  shoppingCartDetail  : {
    shoppingCartTotalTaxAmount : 50,
    shoppingCartItemList : [
      {
        productSKU  : '1234567891234',
        productCode : '1234567891234',
        productName : 'toto'
      },
      {
        productSKU  : '8524567891234',
        productCode : '8524567891234',
        productName : 'tata'
      },
      {
        productSKU  : '9658467891234',
        productCode : '9658467891234',
        productName : 'titi'
      }
  ]
  }
  // fraudData             : {
  //   allowedCardCountryList  : [ 'FRA', 'MUS', 'REU', 'MDG' ],
  //   allowedIpCountryList    : [ 'FRA', 'MUS', 'REU', 'MDG' ]
  // }
};

var transactionReference = '97abc2paapfa1f33a00420070';

var captureData = {
  operationAmount       : 974,
  transactionReference  : transactionReference,
  merchantId            : MERCHANT_ID,
  operationOrigin       : 'my app',
};

var cancelData = {
  transactionReference  : transactionReference,
  operationOrigin       : 'my app',
  merchantId            : '1',
  operationAmount       : 974
};

var paymentData3DSecure = {
  amount                : '974',
  merchantReturnUrl : 'http://localhost:3002',
  cardNumber : '5017679200300300',
  cardExpiryDate        : '202112',
  cardCSCValue          : '985',
  //orderId               : '575acedaa8fa1f3300425001',
  transactionReference  : transactionReference,
  merchantId            : MERCHANT_ID,
  // customerId            : '574eb5e8b7e67f7832f562fc',
  billingContact        : {
    firstname : 'foo',
    lastname  : 'bar',
    email : 'toto@toto.fr'
  },
  billingAddress        : {
    country   : 'REU',
    addressAdditional1 : 'toto route',
    zipCode : '97400'
  },
  customerContact        : {
    firstname : 'foo',
    lastname  : 'bar'
  },
  customerAddress        : {
    country   : 'REU',
    addressAdditional1 : 'toto route',
    zipCode : '97400'
  }
};

var transactionToRetrieve = {
  transactionReference  : transactionReference,
  merchantId            : MERCHANT_ID
};

// Create auth payment
// atos.loadConfig(config).then(function (value) {
//   console.log('===> success load, value is = ', paymentData)

//   atos.modules.creditCard.createAuthorization(paymentData).then(function (value) {
//     console.log('\n===> success create auth payment, value is = ', value)
//   }).catch(function (error) {
//     console.log('\n===> error, is = ', error)
//   });
// }).catch(function (error) {
//   console.log('===> error, is = ', error);
// });

var cardValidateAuthenticationAndOrder = {
  messageVersion : "0.1",
  redirectionData : "q4rc8R2Ntn04IzNBkwLkMUQ1AFNOP1witj2cpb+G9A2snLIXOjRKT2SFaQGecElrm3DiwNcl3LrU4zi7FDWJyabOt9oKekois1dmVSotB/+7z+nx2H4Rr/Jq4B50OsXSLXpqA8neH+ggiBnWbt6aTJyDFdWGPAfdmsGu1ptiL6Q46yZAiNQaFlSy99StLkvPmesQGRNUcodY7qdiPoQlBKLIN0kfDjAPxdIyruV682e+UExpv9najLQt4gMfl6i4Y3C7BUjnqa0I8tzVtl+V9bo+KCtHmqIDatva05gBBzSXfLAIwG7bgglFP2sHt4pvbbjg1xBUZ8N/CtzQZi2CfLN6cIwulFLbUxVRg7Vjb7yg5aesI2z8yM6M6YQ5j3vd1W3D9CtdEidubAAHmRhrNvNZIeue0/Yfq7GgNxO2j5fnJ8dAco9exNk0ENPtxHtJcqdxskjWsrax1INc9NWkqx8oVJQBT9aWlGguWiBwn/SJRhHS1W2ASoUAN7F5cKsyGEnU6OQpU0ElpyzocuMgdBo6eNQCbCHltp3EmcZ12QOZE4+92KxzGcBGEAY3AETSMbL0NLVu8fEjpz6WbAa7Nmyu7nraTLFqV1XHyZXfTOHHj7+IQz/11SK3jM2eea2Nrsq64G4dvsVjGQtwggYVJoEtKZXdPC8oZjsNCr3CvRJjwgbQdIDAbh001jzoemb7V+/WrsUAe3bczJwUINuBRPb3VwM1Z6BpMY1KMHTPZnZPflSD+7/4UOrHVTzoymph9cUnsOUXQEbb27gdubDI7JavaXz1mQAF3CJxcKVrxVBp6Zuo5kcoCm424+8CrUv7dgHNvnmIEpDYGqiGWQzPG1emlCHTpce9gnJHxp4fOYDiyLa1sPAKXQNG0bxeizqipnmAV7vVxg+uSBc73wCXwB71+ufotQYU8i0cJ+bFEQQottiT2bU1Lw1aZxO5Mb+tUGl6w79fm3gEWGoqI38XOFogrPzAnobfMpqo7sY9W+EMmDkt9chCwrUGJT0hqvRShO5bRIvfddOeQk+MYfrPe7Rg7CboIE/37UU4xJFQYSUxB5PdKMOspdt4xJogywhbTqWWZ5Z6XTRKRhv4+Wbki2fCdxNikxbYux0ZvDu6KnaryhCGy/0zbzcMOpSqZlrhnRKXGO8m2lCFF8YCmArQRfFrTG+wJ0FPqHlxfDKunMJfWpUAn/ZOuVK2Zy5je/A+MVFL2n/e3WVQT6CjclSojB+K34k2pJsYIROljDuyp+CZ9n1FQh62m4Cb2rQSBrd3xGDkjJ8MNjspUmzI3A0FcKLxPOSv2ciqPQfT7gmRCDZ6cCV7vOEgnqy3ulxXH7A2seaN9cTbbWlLf7lOAuEPSw==",
  merchantId : MERCHANT_ID,
  transactionReference  : transactionReference
};

// Create 3D Secure
atos.loadConfig(config).then(function (value) {
 // console.log('===> success load, value is = ', paymentData3DSecure)

  atos.modules.creditCard.cardCheckEnrollment(paymentData3DSecure).then(function (value) {
    console.log('\n===> success create auth payment, value is = ', value)
  }).catch(function (error) {
    console.log('\n===> error, is = ', error)
  });
  
  // atos.modules.creditCard.cardValidateAuthenticationAndOrder(cardValidateAuthenticationAndOrder)
  // .then(function (value) {
  //   console.log('\n===> success create auth payment, value is = ', value)
  // }).catch(function (error) {
  //   console.log('\n===> error, is = ', error)
  // });

  // atos.modules.creditCard.capturePayment(captureData).then(function (value) {
  //   console.log('===> success create auth payment, value is = ', value)
  // }).catch(function (error) {
  //   console.log('===> error, is = ', error)
  // });

  // atos.modules.creditCard.getTransactionData(transactionToRetrieve).then(function (value) {
  //   console.log('\n===> success create auth payment, value is = ', value)
  // }).catch(function (error) {
  //   console.log('\n===> error, is = ', error)
  // });
}).catch(function (error) {
  console.log('===> error, is = ', error);
});

// Cancel payment
// atos.loadConfig(config).then(function (value) {
//   console.log('===> success load, value is = ')
//
//   atos.modules.creditCard.cancelPayment(cancelData).then(function (value) {
//     console.log('===> success create auth payment, value is = ', value)
//   }).catch(function (error) {
//     console.log('===> error, is = ', error)
//   });
// }).catch(function (error) {
//   console.log('===> error, is = ', error);
// });
