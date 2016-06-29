var utils = require('../src/modules/utils/')();

var paymentData = {
  amount                : '974',
  cardNumber            : '5017670000008300',
  cardExpiryDate        : '201705',
  cardCSCValue          : '985',
  orderId               : '575acedaa8fa1f33004254a1',
  transactionReference  : '82abc2paapfa1f33a00425aa8',
  merchantId            : '201000007070001',
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
    shoppingCartItemList : [{
      productSKU  : '97434567891234',
      productCode : '1234567891234',
      productName : 'toto'
    }]
  }
  // fraudData             : {
  //   allowedCardCountryList  : [ 'FRA', 'MUS', 'REU', 'MDG' ],
  //   allowedIpCountryList    : [ 'FRA', 'MUS', 'REU', 'MDG' ]
  // }
};

var seal = utils.calculSEAL(paymentData, 'AJEF262FAFE51562EAF6EAF1421SA6');
console.log(' \n ===> SEAL is : ', seal);
