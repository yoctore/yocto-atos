'use strict';

var _       = require('lodash');
var logger  = require('yocto-logger');
var joi     = require('joi');
var Q       = require('q');

/**
* Yocto Atos : Atos wrapper for Sips Office Json Interface
*
* @date   : 06/06/2016
* @author : Cedric Balard <cedric@yocto.re>
* @copyright : Yocto SAS, All right reserved
* @class YoctoAtos
*/
function YoctoAtos (yLogger) {

  /**
   * Contain config of wrapper
   */
  this.config = {};

  /**
   * Indicate if module was correctly enabled and configured
   * @type {Boolean}
   */
  this.enabled = false;

  /**
   * Default logger
   */
  this.logger = yLogger || logger;
}

/**
 * Method that load atos config
 *
 * @param  {Object} config Object config
 * @return {Object}        Return success of promises
 */
YoctoAtos.prototype.loadConfig = function (config) {

  // Create our deferred object, which we will use in our promise chain
  var deferred = Q.defer();

  // joi schema of the config file
  var schema = joi.object().required().keys({
    // Mode used, this will be determine wich Atos host URL will be used
    mode          : joi.string().required().valid([ 'sandbox', 'live' ]),
    // Secret key used to calcul SEAL (hash of the message)
    secretKey     : joi.string().required().empty(),
    // Necessary config that will be send into each request
    config        : joi.object().required().keys({
      // Currency code for the transaction. This code is ISO 4217 compatible.
      currencyCode     : joi.string().required().valid([ '032', '036', '116', '124', '208',
      '344', '356', '392', '410', '484', '554', '578', '702', '752', '756', '826', '840', '901',
      '949', '952', '953', '978', '986']),
      // Version of the merchant's secret key used to calculate the imprint of the message
      keyVersion       : joi.number().integer().required().min(0)
    })
  });

  // validate joi schema with the given file
  var result   = schema.validate(config);

  // check if an error occured
  if (result.error) {
    // An error occured joi schema is not conform
    this.logger.error('[ YoctoAtos.loadConfig.joi ] - an error occured when loading ' +
    'configuration, more details : ' + result.error.toString());
    // Config file was not loaded
    deferred.reject(result.error.toString());
    return deferred.promise;
  }

  // set host with default value by checking mode
  result.value.host = result.value.mode === 'sandbox' ?
  'https://office-server.test.sips-atos.com/rs-services/v2' :
  'https://office-server.sips-atos.com/rs-services/v2';
  this.config   = result.value;
  this.enabled  = true;

  // Atos configured
  this.logger.info('[ YoctoAtos.loadConfig ] - YoctoAtos instance was configured');

  /**
   * Retrive internal modules
   */
  this.modules = {
    creditCard  : require('./modules/creditCard')(this.logger, this.config),
    utils       : require('./modules/utils')(this.logger, this.config)
  };

  // success load
  deferred.resolve(config);

  // return promise
  return deferred.promise;
};

// Default export
module.exports = function (l) {
  // is a valid logger ?
  if (_.isUndefined(l) || _.isNull(l)) {
    logger.warning('[ YoctoAtos.constructor ] - Invalid logger given. Use internal logger');
    // assign
    l = logger;
  }

  // default statement
  return new (YoctoAtos)(l);
};
