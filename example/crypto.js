var utils = require('../src/modules/utils/')();

var paymentData = {
  amount : 55,
  captureMode : 'validation',
  merchantId  : '98466',
  cam : {
    toto : 'catoto',
    tata : 'catata'
  }
};

var seal = utils.calculSEAL(paymentData, 'AJEF262FAFE51562EAF6EAF1421SA6');
console.log(' \n ===> SEAL is : ', seal);
