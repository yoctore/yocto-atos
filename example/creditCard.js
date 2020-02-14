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
        keyVersion    : 1,
        currencyCode  : '978'
      }
    },
    {
      label         : '#2',
      secretKey     : 'key 2',
      merchantId    : '2',
      config : {
        keyVersion    : 1,
        currencyCode  : '978'
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

var transactionReference = '97abc2paapfa1f33a00420091';

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
  captureMode : 'AUTHOR_CAPTURE',
  amount                : '974',
  merchantReturnUrl : 'http://localhost:3002',
  cardNumber : '5017679400300100',
  cardExpiryDate        : '202112',
  cardCSCValue          : '985',
  panType : 'PAN',
  orderId               : '575acedaa8fa1f3300425001',
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
  },
  merchantTransactionDateTime : new Date().toISOString()
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
  redirectionData : "q4rc8R2Ntn04IzNBkwLkMUQ1AFNOP1witj2cpb+G9A2snLIXOjRKT2SFaQGecElrm3DiwNcl3LrU4zi7FDWJyabOt9oKekois1dmVSotB/+7z+nx2H4Rr/Jq4B50OsXSLXpqA8neH+ggiBnWbt6aTJyDFdWGPAfdmsGu1ptiL6Q46yZAiNQaFlSy99StLkvPmesQGRNUcodY7qdiPoQlBKLIN0kfDjAPxdIyruV682e+UExpv9najLQt4gMfl6i4Y3C7BUjnqa0I8tzVtl+V9bo+KCtHmqIDatva05gBBzSXfLAIwG7bgglFP2sHt4pvddAMkq7EfDPaTs7pvbZ7ws0RtGRRJNwUkFdmI3q3KWAbFJ9PfhzuW8mcbYVQzfBd1VjrE8VbUnMUAw2SdqMNhw3YtrYSodIKovhn/pzrv3HGj85Fo+N/2QI/xSI9RGbkhZPBtR84KDPjzWyCsSzWSFe+cSjGT0ZzV/U10uolTH7tzGq2W8NzS5GLAGtCKWMXk85HB66a9dwfT8yN35guQ1nhTYy9nSW9sASeIy++x3BN08f9GOZcqECC8aX5G21wOe44JlMzNn1IboSxuLgJQumYIXhYj1TOjTnpkuKmkOjWI1pcTViWccRDSo6Gz8+lJC7iYvStNSyNV7lE6wd5dk7WVMkwFjoWnAGvegIqn6CVywean8j3wAWM6C91x/R9d6t/db4JUhL9s5g1clprMtf1GiFtUr6LdbCuZznMIRErcjbG4cdriNLYxnWwicJVSeO4LBVfxw0nRzQR00/hCa/DoffUGgnC6woz2qXiyVclgYZpKLpD9lJ8yc7QZq72eex97hM4YN2P14qos4Jw/BNDtZ8cQKeLM2i9QaDtWwfcZ6xGm5td6+/FdYzFHW81uMYmcXTC2Pz7bMBibXD2K82Fqex6BG/eX2jb1thHHqOZKn3j6qhpkoOwhS48+vIspgnj9c+ge54mBjEQ45LMznazmj78nuMtS0jRuG/1grQYfYLEi/b1CqdgB4coPEROn/fdO7ta12zFJ8JQLJPJ1fhnXywrFMkFd1o7jtCiFFT5O5OP2aM/PBVpQ9DYwSaFcJ8wwnxFM4z6KnOjtmbRw/gM+Te/5EkCmHduadtF+RZM5CQ8VPvgLCC8KaZVP1cCo9dNYmNbBfn14w66iyJwu+9LFB2yQ1I+XAbWad+Q3IZGJbbkaB5O3tTlEcw2jkoFcgBbFERZF7UKGjJvm+oZek1d0/LPcWaCxVuBsuklTGIpQfW9WPlXr2c+RMs9fKmS9JslPcAPuDa9o50bMysmCM6nkFvHWHOOxTJq3fHZilGelUi3QmAuSlpJshTOGl7/ki/OX7QVFAwri7qnKpHe+A15hPvusIVk+RB6fQ3eV6Swz5GOhPM5SRGx8ztubW/ryzv3g36okSbGLcL9TGwMQux9f3cmcgFT5EccWpPnHBhw7kYgBi/gYMI0sYYy2pekPa3zU4bOaKeMuEYj3bn5dy6u8iAAS00AXu0RQCnNH4H/yz1jXlxF308k2r1iLz3r",
  merchantId : MERCHANT_ID,
  transactionReference  : transactionReference,
  paResMessage : "a82a8c59-212d-468c-ac6e-59f881a1249d"
};

// Create 3D Secure
atos.loadConfig(config).then(function (value) {
 // console.log('===> success load, value is = ', paymentData3DSecure)

  // atos.modules.creditCard.cardCheckEnrollment(paymentData3DSecure).then(function (value) {
  //   console.log('\n===> success create auth payment, value is = ', value)
  // }).catch(function (error) {
  //   console.log('\n===> error, is = ', error)
  // });
  
  atos.modules.creditCard.cardValidateAuthenticationAndOrder(cardValidateAuthenticationAndOrder)
  .then(function (value) {
    console.log('\n===> success create auth payment, value is = ', value)
  }).catch(function (error) {
    console.log('\n===> error, is = ', error)
  });

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
