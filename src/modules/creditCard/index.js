'use strict';

var _       = require('lodash');
var logger  = require('yocto-logger');
var joi     = require('joi');
var Q       = require('q');
var api     = require('../api')(logger);

/**
* Yocto Atos : Atos wrapper for Sips Office Json Interface
*
* @date   : 06/06/2016
* @author : Cedric Balard <cedric@yocto.re>
* @copyright : Yocto SAS, All right reserved
* @class CreditCard
*/
function CreditCard (yLogger, config) {

  this.config = config || {};

  this.logger = yLogger;
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
    captureDay              : joi.number().integer().optional().min(0).default(7),
    captureMode             : joi.string().optional().default('VALIDATION'),
    cardNumber              : joi.number().integer().required(),
    cardExpiryDate          : joi.string().required().empty(),
    cardCSCValue            : joi.string().required().empty(),
    s10TransactionReference : joi.object().keys({
      s10TransactionId     : joi.string().required().empty(),
      s10TransactionIdDate : joi.string().required().empty(),
    })
  });

  // validate joi schema with the given file
  var result   = schema.validate(paymentData);

  // check if an error occured
  if (result.error) {
    // An error occured joi schema is not conform
    this.logger.error('[ YoctoAtos.CreditCard.createAuthorization.joi ] - an error' +
    ' occured schema is not conform, more details : ' + result.error.toString());
    // Config file was not loaded
    deferred.reject(result.error.toString());
    return deferred.promise;
  }

  // override var with default value
  paymentData = result.value;

  this.logger.debug('[ YoctoAtos.CreditCard.createAuthorization ] - a new request will' +
  ' be send to create authorization payment');

  // Call api module to make an request to atos
  api.process(this.config, 'checkout/cardOrder', paymentData, 'createAuthorization', false).then(
  function (value) {

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
    s10TransactionReference : joi.object().keys({
      s10TransactionId     : joi.string().required().empty(),
      s10TransactionIdDate : joi.string().required().empty(),
    })
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
  api.process(this.config, 'cashManagement/validate', captureData, 'capturePayment').then(
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
    operationAmount         : joi.number().integer().optional().min(0).max(0).default(0),
    s10TransactionReference : joi.object().keys({
      s10TransactionId     : joi.string().required().empty(),
      s10TransactionIdDate : joi.string().required().empty(),
    })
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
  api.process(this.config, 'cashManagement/cancel', cancelData, 'capturePayment').then(
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
