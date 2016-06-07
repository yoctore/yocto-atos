var atos = require('../src')();

var config = {
  mode : 'sandbox',
  secretKey         : '484GEF87A45AEAA87842634A684A354A643541AA',
  config : {
    currencyCode      : '978',
    interfaceVersion  : 'IR_WS_2.3',
    keyVersion        : 1,
    merchantId        : '4545121548451215465432165'
  }
};

var paymentData = {
  amount          : 123,
  cardNumber      : '559955995599559955',
  cardExpiryDate  : '201905',
  cardCSCValue    : '985',
  s10TransactionReference : {
    s10TransactionId      : '777888899445566112233',
    s10TransactionIdDate  : '20050606'
  }
};

var captureData = {
  operationAmount : 100,
  s10TransactionReference : {
    s10TransactionId      : '777888899445566112233',
    s10TransactionIdDate  : '20050606'
  }
};

var cancelData = {
  s10TransactionReference : {
    s10TransactionId      : '777888899445566112233',
    s10TransactionIdDate  : '20050606'
  }
};

// atos.loadConfig(config).then(function (value) {
//   console.log('===> success load, value is = ')
//
//   atos.modules.creditCard.createAuthorization(paymentData).then(function (value) {
//     console.log('===> success create auth payment, value is = ', value)
//   }).catch(function (error) {
//     console.log('===> error, is = ', error)
//   });
// }).catch(function (error) {
//   console.log('===> error, is = ', error);
// });
//
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

atos.loadConfig(config).then(function (value) {
  console.log('===> success load, value is = ')

  atos.modules.creditCard.cancelPayment(cancelData).then(function (value) {
    console.log('===> success create auth payment, value is = ', value)
  }).catch(function (error) {
    console.log('===> error, is = ', error)
  });
}).catch(function (error) {
  console.log('===> error, is = ', error);
});
