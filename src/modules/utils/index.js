'use strict';

var logger  = require('yocto-logger');
var crypto  = require('crypto');
var _       = require('lodash');

/**
 * Yocto Atos : Atos wrapper for Sips Office Json Interface
 *
 * @date   : 06/06/2016
 * @author : Cedric Balard <cedric@yocto.re>
 * @copyright : Yocto SAS, All right reserved
 *
 * @class utils
 */
function Utils (logger) {
  /**
   * Logger instance
   *
   * @property logger
   */
  this.logger     = logger;
}

/**
 * Calcul SEAL of an Object and return the hash
 *
 * @param {Object} data Object to Calcul hashMac
 * @param {String} secretKey THe secretKey use to create hashMac
 * @return {String|boolean} Return the hash or false if error
 */
Utils.prototype.calculSEAL = function (data, secretKey) {

  data = _.isObject(data) ? JSON.stringify(data) : data;

  // retrieve hashMac
  var hmac = crypto.createHmac('sha256', secretKey);

  // set data to create Hmac
  hmac.update(data);

  // Return hmach
  return hmac.digest('hex');
};

// Default export
module.exports = function (l) {
  // is a valid logger ?
  if (_.isUndefined(l) || _.isNull(l)) {
    logger.warning('[ Utils.constructor ] - Invalid logger given. Use internal logger');
    // assign
    l = logger;
  }
  // default statement
  return new (Utils)(l);
};
