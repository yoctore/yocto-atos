var atos = require('../src')();

var paymentData = {
  amount : 55,
  captureMode : 'validation'
};

var seal = atos.modules.utils.calculSEAL(paymentData, 'AJEF262FAFE51562EAF6EAF1421SA6');
console.log(' \n ===> SEAL is : ', seal);
