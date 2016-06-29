var atos = require('../src')();

var config = {
  mode      : 'sandbox',
  shops : [
    {
      label         : '#1',
      secretKey     : 'key1',
      merchantId    : '1',
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
  cardExpiryDate        : '201705',
  cardCSCValue          : '985',
  orderId               : '575acedaa8fa1f33004254a1',
  transactionReference  : '97abc2paapfa1f33a00425aa8',
  merchantId            : '1',
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

var captureData = {
  operationAmount       : 974,
  transactionReference  : '97abc2paapfa1f33a00425aa8',
  merchantId            : '1',
  operationOrigin       : 'my app',
};

var cancelData = {
  transactionReference  : '3aabcedaapfa1f33a00425aa8',
  operationOrigin       : 'my app',
  merchantId            : '1',
  operationAmount       : 974
};

// // Create auth payment
// atos.loadConfig(config).then(function (value) {
//   console.log('===> success load, value is = ')
//
//   atos.modules.creditCard.createAuthorization(paymentData).then(function (value) {
//     console.log('\n===> success create auth payment, value is = ', value)
//   }).catch(function (error) {
//     console.log('\n===> error, is = ', error)
//   });
// }).catch(function (error) {
//   console.log('===> error, is = ', error);
// });

// CAptue paument
atos.loadConfig(config).then(function (value) {
  console.log('===> success load, value is = ')

  atos.modules.creditCard.capturePayment(captureData).then(function (value) {
    console.log('===> success create auth payment, value is = ', value)
  }).catch(function (error) {
    console.log('===> error, is = ', error)
  });
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
