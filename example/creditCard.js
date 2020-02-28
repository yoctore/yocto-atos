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

var transactionReference = '97abc2paapfa1f33a00420098';

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
  //cardNumber : '5017679400300100', // Carte OK enrollé
  cardNumber : '5017679100900100', // Carte KO non enrollé
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
  redirectionData : "q4rc8R2Ntn04IzNBkwLkMUQ1AFNOP1witj2cpb+G9A2snLIXOjRKT2SFaQGecElrm3DiwNcl3LrU4zi7FDWJyabOt9oKekois1dmVSotB/+7z+nx2H4Rr/Jq4B50OsXSLXpqA8neH+ggiBnWbt6aTJyDFdWGPAfdmsGu1ptiL6Q46yZAiNQaFlSy99StLkvPmesQGRNUcodY7qdiPoQlBKLIN0kfDjAPxdIyruV682e+UExpv9najLQt4gMfl6i4Y3C7BUjnqa0I8tzVtl+V9bo+KCtHmqIDatva05gBBzSXfLAIwG7bgglFP2sHt4pvDoXwMZ2Uc+QiXD60aph1b7+a/Mk+GBcscTwhH//CBAasuGCj5MiTbhyx4eVZsTjC40a3eGL/ihyzwHP4Ko7SlAotbD4/FI7xbCzKNqVl/aUr1/JKni15LVq0IuMuZ9G9IrRUn4/HKuBZfMUuxvNMDVb1MS3Fz3AR0oWI/55yrlt0fiLxBIs0MC/R+qGSVcOkyW8vQc0V8MHWOVd7H6V5k65FrJiKhflesp1ZaZ58C1Uh6fSGLYResCxxZ+5kGzxHlHfYxZLatbiAjoHFSmQQIZAPZktZps45ty5yUb+FGeszmJJvcVizQw/PdQTkkyQ7yeGhARsYUHqRozQXoGuOSoxgbWTxZtEzXIWLSlkj1hXrfYM0HxKGNYx7GM2neXAIUqbpBfrjt/w6fA+kWMP/W2NektoNigJXb8OLng5lWttBbnemT3p6AFuf/qV1i5Goe8suwsitu4rdG0J7KFQPLcLNhnb0mqvHco85WXthX8PY0MN0zVcqCEs0UdyWqciZvdVbgtTQ7tMDwiPxQJ6PeWFZUT1F+VUwcEyuN3lvEjupNTLw6FIeavDENK7BbK94p+8DBD0uXvIPOsVeO8+usyMLFhJaQR77u5DqpWLkNZ38isWILuuNtIp5Z0gOj1h8HsmCCtMc2EsuxY4nJcPR4T4NbcmjVCfxsCIH5Y0M1vOUQ+G+XlPhojPOFiFGr1m1QiV2EcONgejNqmkQL7Jvn4LdLB2O5ljgeiH75dfevdsV5xdEhgQKizViJ2xd1wVlmJegBV2C6rSEpR94Ye6nl7vRrO8YdnBekDxKM8AqzTfKv6I6ku71jzYEZnqDCFO+0Ncy4wUcm3eP/LbvkCIB+Y2n6G4YbmPlaEBXTjG3xFqgtAZAiheLUqjak+GwbouFJoUjYKDeN1+3ZJB/VeYEp1LJHStJ08jweJulIafq5arsi/oVZ4laVGX87jH5SGV0J1FINDOuHiqCSou7s0yW7cHBUgI2wED1/sEPYR3BB/BCef7B1eGgpba69WUy3dMzDtMXb6UyIrCpg2bT0dJ1OFKLw92IIPrCT492bevy8q3Kb0WpoSq+GzKUb7mU01viJNiCeFmozo1hMyiJJAcXw1u3O4VisqiiP9tXYLErxoAOvtt4J2FFfApTpuQbhFwbq/uLsKlyo8h4n6BRg3m+DUos586tAuISgbKGWsHAa7DOa0AIiVQIH/LqbBQIO8lu",
  merchantId : MERCHANT_ID,
  transactionReference  : transactionReference,
  paResMessage : "ee7d71fd-3a99-47f1-a863-007eb28f4d90"
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
