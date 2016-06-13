var atos = require('../src')();

var config = {
  mode      : 'sandbox',
  secretKey : 'yourKey',
  config    : {
    currencyCode      : '978',
    interfaceVersion  : 'IR_WS_2.11',
    keyVersion        : '1'
  }
};

var paymentData = {
  amount          : '123',
  cardNumber      : '5017670000005900',
  cardExpiryDate  : '201905',
  cardCSCValue    : '985',
  orderId         : '575acedaa8fa1f33004254a1',
  // transactionReference : '575acedaa8fa1f33004254a3',
  // s10TransactionReference : {
  //   s10TransactionId      : '156985',
  //   s10TransactionIdDate  : '20160613'
  // },
  merchantId      : '201000007070001'
};

var captureData = {
  operationAmount         : '100',
  s10TransactionReference : {
    s10TransactionId      : '156985',
    s10TransactionIdDate  : '20160613'
  },
  merchantId              : '201000007070001'
};

var cancelData = {
  s10TransactionReference : {
    s10TransactionId      : '156985',
    s10TransactionIdDate  : '20050606'
  },
  merchantId              : '201000007070001'
};

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
