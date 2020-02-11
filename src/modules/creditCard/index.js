'use strict';

var _       = require('lodash');
var logger  = require('yocto-logger');
var joi     = require('joi');
var Q       = require('q');
var utils   = require('yocto-utils');

/**
* Yocto Atos : Atos wrapper for Sips Office Json Interface
*
* @date   : 06/06/2016
* @author : Cedric Balard <cedric@yocto.re>
* @copyright : Yocto SAS, All right reserved
* @class CreditCard
*/
function CreditCard (yLogger, config) {

  // config
  this.config = config || {};

  // default logger
  this.logger = yLogger;

  // require api
  this.api = require('../api')(logger);
}

/**
 * Method that trying to retrieve authorization for an credit card to make payment
 *
 * @param  {Object} paymentData the necessary data to create payment authorization
 * @return {boolean} true if file is loaded, otherwise false
 */
CreditCard.prototype.createAuthorization = function (paymentData) {
  // create a promise deferred
  var deferred = Q.defer();

  // Joi schema for create authorization
  var schema = joi.object().required().keys({
    amount                  : joi.number().integer().required().min(0),
    captureDay              : joi.number().integer().optional().min(0).default(6),
    orderChannel            : joi.string().optional().default('INTERNET'),
    captureMode             : joi.string().optional().default('VALIDATION'),
    paymentPattern          : joi.string().optional().default('ONE_SHOT'),
    cardNumber              : joi.string().creditCard().required(),
    cardExpiryDate          : joi.string().required().empty(),
    cardCSCValue            : joi.string().required().empty(),
    orderId                 : joi.string().optional().empty(),
    transactionReference    : joi.string().optional().empty(),
    interfaceVersion        : joi.string().optional().default('IR_WS_2.12'),
    // Identifier of the shop, this value is provided to the merchant by Sips
    merchantId              : joi.string().optional().empty(),
    customerId              : joi.string().optional().empty(),
    customerIpAddress       : joi.string().optional().empty(),
    invoiceReference        : joi.string().optional().empty(),
    transactionOrigin       : joi.string().optional().empty(),
    billingAddress          : joi.object().optional().keys({
      addressAdditional1  : joi.string().optional().empty(),
      addressAdditional2  : joi.string().optional().empty(),
      addressAdditional3  : joi.string().optional().empty(),
      city                : joi.string().optional().empty(),
      company             : joi.string().optional().empty(),
      country             : joi.string().optional().length(3),
      postBox             : joi.string().optional().empty(),
      state               : joi.string().optional().empty(),
      street              : joi.string().optional().empty(),
      streetNumber        : joi.string().optional().empty(),
      zipCode             : joi.string().optional().empty(),
    }),
    billingContact          : joi.object().optional().keys({
      email     : joi.string().email().optional().empty(),
      firstname : joi.string().optional().empty(),
      gender    : joi.string().optional().empty().allow([ 'M', 'F']),
      lastname  : joi.string().optional().empty(),
      mobile    : joi.string().optional().empty(),
      phone     : joi.string().optional().empty(),
      title     : joi.string().optional().empty()
    }),
    customerAddress         : joi.object().optional().keys({
      addressAdditional1  : joi.string().optional().empty(),
      addressAdditional2  : joi.string().optional().empty(),
      addressAdditional3  : joi.string().optional().empty(),
      city                : joi.string().optional().empty(),
      company             : joi.string().optional().empty(),
      country             : joi.string().optional().length(3),
      postBox             : joi.string().optional().empty(),
      state               : joi.string().optional().empty(),
      street              : joi.string().optional().empty(),
      streetNumber        : joi.string().optional().empty(),
      zipCode             : joi.string().optional().empty(),
    }),
    customerContact         : joi.object().optional().keys({
      email     : joi.string().email().optional().empty(),
      firstname : joi.string().optional().empty(),
      gender    : joi.string().optional().empty().allow([ 'M', 'F']),
      lastname  : joi.string().optional().empty(),
      mobile    : joi.string().optional().empty(),
      phone     : joi.string().optional().empty(),
      title     : joi.string().optional().empty()
    }),
    deliveryAddress         : joi.object().optional().keys({
      addressAdditional1  : joi.string().optional().empty(),
      addressAdditional2  : joi.string().optional().empty(),
      addressAdditional3  : joi.string().optional().empty(),
      city                : joi.string().optional().empty(),
      company             : joi.string().optional().empty(),
      country             : joi.string().optional().length(3),
      postBox             : joi.string().optional().empty(),
      state               : joi.string().optional().empty(),
      street              : joi.string().optional().empty(),
      streetNumber        : joi.string().optional().empty(),
      zipCode             : joi.string().optional().empty(),
    }),
    deliveryContact         : joi.object().optional().keys({
      email     : joi.string().email().optional().empty(),
      firstname : joi.string().optional().empty(),
      gender    : joi.string().optional().empty().allow([ 'M', 'F']),
      lastname  : joi.string().optional().empty(),
      mobile    : joi.string().optional().empty(),
      phone     : joi.string().optional().empty(),
      title     : joi.string().optional().empty()
    }),
    shoppingCartDetail      : joi.object().optional().keys({
      shoppingCartTotalAmount     : joi.number().integer().optional().min(0),
      shoppingCartTotalQuantity   : joi.number().integer().optional().min(0),
      shoppingCartTotalTaxAmount  : joi.number().integer().optional().min(0),
      // The most expensive product in the shopping cart.
      mainProduct                 : joi.string().optional().empty(),
      shoppingCartItemList        : joi.array().items(
        joi.object().keys({
          // Monetary value of the tax for the product (unit)
          productUnitTaxAmount  : joi.number().optional().min(0),
          productName           : joi.string().optional().empty(),
          productDescription    : joi.string().optional().empty(),
          // Code of the ordered product.
          productCode           : joi.string().optional().empty(),
          // Merchant’s product identifier code, sent back in the response without modification.
          productSKU            : joi.string().optional().empty(),
          // Unit amount of the product
          productUnitAmount     : joi.number().optional().min(0),
          productQuantity       : joi.number().optional().min(0),
          productTaxRate        : joi.number().optional().min(0),
          productCategory       : joi.string().optional().empty()
        })
      ).optional()
    }),
    fraudData               : joi.object().optional().keys({
      allowedCardCountryList  : joi.array().optional().items(
        joi.string().length(3)
      ),
      allowedIpCountryList    :  joi.array().optional().items(
        joi.string().length(3)
      ),
      bypassCtrlList          : joi.array().optional().items(
        joi.string().empty()
      ),
      bypassInfoList          : joi.string().optional().empty().allow([
        'IpCountry', 'Card', 'All'
      ]),
      deniedCardCountryList   :  joi.array().optional().items(
        joi.string().length(3)
      ),
      deniedIpCountryList     :  joi.array().optional().items(
        joi.string().length(3)
      )
    })
  });

  // validate joi schema with the given file
  var result   = schema.validate(paymentData);

  // check if an error occured
  if (result.error) {
    // An error occured joi schema is not conform
    this.logger.error('[ YoctoAtos.CreditCard.createAuthorization.joi ] - an error' +
    ' occured schema is not conform, more details : ' + utils.obj.inspect(result.error));
    // Config file was not loaded
    deferred.reject(result.error.toString());
    return deferred.promise;
  }

  // override var with default value
  paymentData = result.value;

  this.logger.debug('[ YoctoAtos.CreditCard.createAuthorization ] - a new request will' +
  ' be send to create authorization payment');

  // Call api module to make an request to atos
  this.api.process(this.config, 'checkout/cardOrder', paymentData, 'createAuthorization', false).
  then(function (value) {

    // resolve success
    deferred.resolve(value);
  }).catch(function (error) {

    this.logger.error('[ YoctoAtos.CreditCard.createAuthorization.create ] - the' +
    ' payment was not authorized');

    // reject error
    deferred.reject(error);
  }.bind(this));

  // return promise of process
  return deferred.promise;
};

/**
 * Method that capture an existing authorization pauymebt
 *
 * @param  {Object} captureData the necessary data to capture authorization
 * @return {boolean} true if file is loaded, otherwise false
 */
CreditCard.prototype.capturePayment = function (captureData) {
  // create a promise deferred
  var deferred = Q.defer();

  // Joi schema for create authorization
  var schema = joi.object().required().keys({
    operationAmount         : joi.number().integer().required().min(0),
    transactionReference    : joi.string().optional().empty(),
    // Identifier of the shop, this value is provided to the merchant by Sips
    merchantId              : joi.string().required().empty(),
    interfaceVersion        : joi.string().optional().default('CR_WS_2.12'),
    operationOrigin         : joi.string().optional().empty()
  });

  // validate joi schema with the given file
  var result   = schema.validate(captureData);

  // check if an error occured
  if (result.error) {
    // An error occured joi schema is not conform
    this.logger.error('[ YoctoAtos.CreditCard.capturePayment.joi ] - an error' +
    ' occured schema is not conform, more details : ' + result.error.toString());
    // Config file was not loaded
    deferred.reject(result.error.toString());
    return deferred.promise;
  }

  // override var with default value
  captureData = result.value;

  this.logger.debug('[ YoctoAtos.CreditCard.capturePayment ] - a new request will' +
  ' be send to create authorization payment');

  // Call api module to make an request to atos to capture payment
  this.api.process(this.config, 'cashManagement/validate', captureData, 'capturePayment').then(
  function (value) {

    // resolve success
    deferred.resolve(value);
  }).catch(function (error) {

    this.logger.error('[ YoctoAtos.CreditCard.capturePayment ] - the' +
    ' payment was not authorized');

    // reject error
    deferred.reject(error);
  }.bind(this));

  // return promise of process
  return deferred.promise;
};

/**
 * Method that cancel an payment cancel
 *
 * @param  {Object} cancelData the necessary data to cancel payment authorization
 * @return {boolean} true if file is loaded, otherwise false
 */
CreditCard.prototype.cancelPayment = function (cancelData) {
  // create a promise deferred
  var deferred = Q.defer();

  // Joi schema for create authorization
  var schema = joi.object().required().keys({
    operationAmount         : joi.number().integer().required().min(0),
    s10TransactionReference : joi.object().optional().keys({
      s10TransactionId     : joi.string().required().empty(),
      s10TransactionIdDate : joi.string().required().empty(),
    }),
    // Identifier of the shop, this value is provided to the merchant by Sips
    merchantId              : joi.string().required().empty(),
    interfaceVersion        : joi.string().optional().default('CR_WS_2.12'),
    transactionReference    : joi.string().optional().empty(),
    operationOrigin         : joi.string().optional().empty()
  });

  // validate joi schema with the given file
  var result   = schema.validate(cancelData);

  // check if an error occured
  if (result.error) {
    // An error occured joi schema is not conform
    this.logger.error('[ YoctoAtos.CreditCard.cancelPayment.joi ] - an error' +
    ' occured schema is not conform, more details : ' + result.error.toString());
    // Config file was not loaded
    deferred.reject(result.error.toString());
    return deferred.promise;
  }

  // override var with default value
  cancelData = result.value;

  this.logger.debug('[ YoctoAtos.CreditCard.cancelPayment ] - a new request will' +
  ' be send to create authorization payment');

  // Call api module to make an request to atos to capture payment
  this.api.process(this.config, 'cashManagement/cancel', cancelData, 'capturePayment').then(
  function (value) {

    // resolve success
    deferred.resolve(value);
  }).catch(function (error) {

    this.logger.error('[ YoctoAtos.CreditCard.cancelPayment ] - the' +
    ' payment was not authorized');

    // reject error
    deferred.reject(error);
  }.bind(this));

  // return promise of process
  return deferred.promise;
};

/**
 * Method that trying to create 3D Secure
 *
 * @param  {Object} paymentData the necessary data to create check enrollment
 * @return {boolean} true if file is loaded, otherwise false
 */
CreditCard.prototype.cardCheckEnrollment = function (paymentData) {
  // create a promise deferred
  var deferred = Q.defer();

  // Joi schema for create authorization
  var schema = joi.object().required().keys({
    amount                  : joi.number().integer().required().min(0),
    captureDay              : joi.number().integer().optional().min(0).default(6),
    orderChannel            : joi.string().optional().default('INTERNET'),
    captureMode             : joi.string().optional().default('VALIDATION'),
    paymentPattern          : joi.string().optional().default('ONE_SHOT'),
    cardNumber              : joi.string().creditCard().required(),
    merchantReturnUrl       : joi.string().empty(),
    cardExpiryDate          : joi.string().required().empty(),
    cardCSCValue            : joi.string().required().empty(),
    orderId                 : joi.string().optional().empty(),
    transactionReference    : joi.string().optional().empty(),
    interfaceVersion        : joi.string().optional().default('IR_WS_2.29'),
    // Identifier of the shop, this value is provided to the merchant by Sips
    merchantId              : joi.string().optional().empty(),
    customerId              : joi.string().optional().empty(),
    customerIpAddress       : joi.string().optional().empty(),
    invoiceReference        : joi.string().optional().empty(),
    transactionOrigin       : joi.string().optional().empty(),
    billingAddress          : joi.object().optional().keys({
      addressAdditional1  : joi.string().optional().empty(),
      addressAdditional2  : joi.string().optional().empty(),
      addressAdditional3  : joi.string().optional().empty(),
      city                : joi.string().optional().empty(),
      company             : joi.string().optional().empty(),
      country             : joi.string().optional().length(3),
      postBox             : joi.string().optional().empty(),
      state               : joi.string().optional().empty(),
      street              : joi.string().optional().empty(),
      streetNumber        : joi.string().optional().empty(),
      zipCode             : joi.string().optional().empty(),
    }),
    billingContact          : joi.object().optional().keys({
      email     : joi.string().email().optional().empty(),
      firstname : joi.string().optional().empty(),
      gender    : joi.string().optional().empty().allow([ 'M', 'F']),
      lastname  : joi.string().optional().empty(),
      mobile    : joi.string().optional().empty(),
      phone     : joi.string().optional().empty(),
      title     : joi.string().optional().empty()
    }),
    customerAddress         : joi.object().optional().keys({
      addressAdditional1  : joi.string().optional().empty(),
      addressAdditional2  : joi.string().optional().empty(),
      addressAdditional3  : joi.string().optional().empty(),
      city                : joi.string().optional().empty(),
      company             : joi.string().optional().empty(),
      country             : joi.string().optional().length(3),
      postBox             : joi.string().optional().empty(),
      state               : joi.string().optional().empty(),
      street              : joi.string().optional().empty(),
      streetNumber        : joi.string().optional().empty(),
      zipCode             : joi.string().optional().empty(),
    }),
    customerContact         : joi.object().optional().keys({
      email     : joi.string().email().optional().empty(),
      firstname : joi.string().optional().empty(),
      gender    : joi.string().optional().empty().allow([ 'M', 'F']),
      lastname  : joi.string().optional().empty(),
      mobile    : joi.string().optional().empty(),
      phone     : joi.string().optional().empty(),
      title     : joi.string().optional().empty()
    }),
    deliveryAddress         : joi.object().optional().keys({
      addressAdditional1  : joi.string().optional().empty(),
      addressAdditional2  : joi.string().optional().empty(),
      addressAdditional3  : joi.string().optional().empty(),
      city                : joi.string().optional().empty(),
      company             : joi.string().optional().empty(),
      country             : joi.string().optional().length(3),
      postBox             : joi.string().optional().empty(),
      state               : joi.string().optional().empty(),
      street              : joi.string().optional().empty(),
      streetNumber        : joi.string().optional().empty(),
      zipCode             : joi.string().optional().empty(),
    }),
    deliveryContact         : joi.object().optional().keys({
      email     : joi.string().email().optional().empty(),
      firstname : joi.string().optional().empty(),
      gender    : joi.string().optional().empty().allow([ 'M', 'F']),
      lastname  : joi.string().optional().empty(),
      mobile    : joi.string().optional().empty(),
      phone     : joi.string().optional().empty(),
      title     : joi.string().optional().empty()
    }),
    shoppingCartDetail      : joi.object().optional().keys({
      shoppingCartTotalAmount     : joi.number().integer().optional().min(0),
      shoppingCartTotalQuantity   : joi.number().integer().optional().min(0),
      shoppingCartTotalTaxAmount  : joi.number().integer().optional().min(0),
      // The most expensive product in the shopping cart.
      mainProduct                 : joi.string().optional().empty(),
      shoppingCartItemList        : joi.array().items(
        joi.object().keys({
          // Monetary value of the tax for the product (unit)
          productUnitTaxAmount  : joi.number().optional().min(0),
          productName           : joi.string().optional().empty(),
          productDescription    : joi.string().optional().empty(),
          // Code of the ordered product.
          productCode           : joi.string().optional().empty(),
          // Merchant’s product identifier code, sent back in the response without modification.
          productSKU            : joi.string().optional().empty(),
          // Unit amount of the product
          productUnitAmount     : joi.number().optional().min(0),
          productQuantity       : joi.number().optional().min(0),
          productTaxRate        : joi.number().optional().min(0),
          productCategory       : joi.string().optional().empty()
        })
      ).optional()
    }),
    fraudData               : joi.object().optional().keys({
      allowedCardCountryList  : joi.array().optional().items(
        joi.string().length(3)
      ),
      allowedIpCountryList    :  joi.array().optional().items(
        joi.string().length(3)
      ),
      bypassCtrlList          : joi.array().optional().items(
        joi.string().empty()
      ),
      bypassInfoList          : joi.string().optional().empty().allow([
        'IpCountry', 'Card', 'All'
      ]),
      deniedCardCountryList   :  joi.array().optional().items(
        joi.string().length(3)
      ),
      deniedIpCountryList     :  joi.array().optional().items(
        joi.string().length(3)
      )
    })
  });

  // validate joi schema with the given file
  var result   = schema.validate(paymentData);

  // check if an error occured
  if (result.error) {
    // An error occured joi schema is not conform
    this.logger.error('[ YoctoAtos.CreditCard.cardCheckEnrollment.joi ] - an error' +
    ' occured schema is not conform, more details : ' + utils.obj.inspect(result.error));
    // Config file was not loaded
    deferred.reject(result.error.toString());
    return deferred.promise;
  }

  // override var with default value
  paymentData = result.value;

  this.logger.debug('[ YoctoAtos.CreditCard.cardCheckEnrollment ] - a new request will' +
  ' be send to create authorization payment');

  // Call api module to make an request to atos
  this.api.process(this.config, 'checkout/cardCheckEnrollment', paymentData, 'cardCheckEnrollment',
  true).then(function (value) {

    // resolve success
    deferred.resolve(value);
  }).catch(function (error) {

    this.logger.error('[ YoctoAtos.CreditCard.cardCheckEnrollment.create ] - the' +
    ' payment was not authorized');

    // reject error
    deferred.reject(error);
  }.bind(this));

  // return promise of process
  return deferred.promise;
};

/**
 * Method that retrieve transaction data
 *
 * @param  {Object} transactionData the necessary data to create check enrollment
 * @return {boolean} true if file is loaded, otherwise false
 */
CreditCard.prototype.getTransactionData = function (transactionData) {
  // create a promise deferred
  var deferred = Q.defer();

  // Joi schema for create authorization
  var schema = joi.object().required().keys({
    // Identifier of the shop, this value is provided to the merchant by Sips
    merchantId              : joi.string().optional().empty(),
    interfaceVersion        : joi.string().optional().default('DR_WS_2.3'),
    transactionReference    : joi.string().optional().empty(),
  });

  // validate joi schema with the given file
  var result   = schema.validate(transactionData);

  // check if an error occured
  if (result.error) {
    // An error occured joi schema is not conform
    this.logger.error('[ YoctoAtos.CreditCard.getTransactionData.joi ] - an error' +
    ' occured schema is not conform, more details : ' + utils.obj.inspect(result.error));
    // Config file was not loaded
    deferred.reject(result.error.toString());
    return deferred.promise;
  }

  // override var with default value
  transactionData = result.value;

  this.logger.debug('[ YoctoAtos.CreditCard.getTransactionData ] - a new request will' +
  ' be send to create authorization payment');

  this.api.process(this.config, 'diagnostic/getTransactionData', transactionData,
  'getTransactionData', true).then(function (value) {

    // resolve success
    deferred.resolve(value);
  }).catch(function (error) {

    this.logger.error('[ YoctoAtos.CreditCard.getTransactionData.create ] - the' +
    ' payment was not authorized');

    // reject error
    deferred.reject(error);
  }.bind(this));

  // return promise of process
  return deferred.promise;
};

/**
 * Method that retrieve Validate an 3D Secure Payment
 *
 * @param  {Object} paymentData the necessary data to create check enrollment
 * @return {boolean} true if file is loaded, otherwise false
 */
CreditCard.prototype.cardValidateAuthenticationAndOrder = function (paymentData) {
  // create a promise deferred
  var deferred = Q.defer();

  // Joi schema for create authorization
  var schema = joi.object().required().keys({
    // Identifier of the shop, this value is provided to the merchant by Sips
    merchantId           : joi.string().optional().empty(),
    interfaceVersion     : joi.string().optional().default('IR_WS_2.29'),
    messageVersion       : joi.string().required().empty(),
    redirectionData      : joi.string().required(),
    transactionReference : joi.string().required()
  });

  // validate joi schema with the given file
  var result   = schema.validate(paymentData);

  // check if an error occured
  if (result.error) {
    // An error occured joi schema is not conform
    this.logger.error('[ YoctoAtos.CreditCard.cardValidateAuthenticationAndOrder.joi ] - an error' +
    ' occured schema is not conform, more details : ' + utils.obj.inspect(result.error));
    // Config file was not loaded
    deferred.reject(result.error.toString());
    return deferred.promise;
  }

  // override var with default value
  paymentData = result.value;

  this.logger.debug('[ YoctoAtos.CreditCard.cardValidateAuthenticationAndOrder ] - a new request ' +
  'will be send to create authorization payment');

  this.api.process(this.config, 'checkout/cardValidateAuthenticationAndOrder', paymentData,
  'cardValidateAuthenticationAndOrder', true, true).
  then(function (value) {

    // resolve success
    deferred.resolve(value);
  }).catch(function (error) {

    this.logger.error('[ YoctoAtos.CreditCard.cardValidateAuthenticationAndOrder.create ] - the' +
    ' payment was not authorized');

    // reject error
    deferred.reject(error);
  }.bind(this));

  // return promise of process
  return deferred.promise;
};

// Default export
module.exports = function (l, config) {
  // is a valid logger ?
  if (_.isUndefined(l) || _.isNull(l)) {
    logger.warning('[ CreditCard.constructor ] - Invalid logger given. Use internal logger');
    // assign
    l = logger;
  }

  // default statement
  return new (CreditCard)(l, config);
};
