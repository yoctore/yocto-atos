var atos = require('../src')();

var config = {
  mode      : 'sandbox',
  secretKey : 'mykey',
  config    : {
    currencyCode : '978',
    keyVersion   : 1
  }
};

var paymentData = {
  amount                : '974',
  cardNumber            : '5017670000005900',
  cardExpiryDate        : '201705',
  cardCSCValue          : '985',
  orderId               : '575acedaa8fa1f33004254a1',
  transactionReference  : '3aabcepaapfa1f33a00425aa8',
  merchantId            : '1'
};

var captureData = {
  operationAmount       : 974,
  transactionReference  : '3aabcedaapfa1f33a00425aa8',
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
atos.loadConfig(config).then(function (value) {
  console.log('===> success load, value is = ')

  atos.modules.creditCard.createAuthorization(paymentData).then(function (value) {
    console.log('\n===> success create auth payment, value is = ', value)
  }).catch(function (error) {
    console.log('\n===> error, is = ', error)
  });
}).catch(function (error) {
  console.log('===> error, is = ', error);
});

// // CAptue paument
// atos.loadConfig(config).then(function (value) {
//   console.log('===> success load, value is = ')
//
//   atos.modules.creditCard.capturePayment(captureData).then(function (value) {
//     console.log('===> success create auth payment, value is = ', value)
//   }).catch(function (error) {
//     console.log('===> error, is = ', error)
//   });
// }).catch(function (error) {
//   console.log('===> error, is = ', error);
// });

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
