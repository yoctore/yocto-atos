'use strict';

var logger  = require('yocto-logger');
var crypto  = require('crypto');
var _       = require('lodash');
var utf8    = require('utf8');

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

  var seal = '';

  // omit keys
  data = _.omit(data, [ 'keyVersion', 'sealAlgorithm' ]);

  // Sort all keys and concat all value of keys to make the seal string
  _.each(_.sortBy(_.keys(data)), function (k) {

    // check if is object
    if (!_.isObject(data[k])) {
      // is not object
      return seal += data[k];
    }

    // Is obcject so resort all keys
    _.each(_.sortBy(_.keys(data[k])), function (k1) {

      // check if is object
      if (!_.isObject(data[k][k1])) {
        // is not object
        return seal += data[k][k1];
      }

      // check if is array
      if (_.isArray(data[k][k1])) {

        // Is obcject so resort all keys
        _.each(_.sortBy(_.keys(data[k][k1])), function (k2) {

          // check is string
          if (!_.isObject(data[k][k1][k2])) {
            return seal += data[k][k1][k2];
          }

          // Is obcject so resort all keys
          _.each(_.sortBy(_.keys(data[k][k1][k2])), function (k3) {
            seal += data[k][k1][k2][k3];
          });
        });
      } else {
        // Is obcject so resort all keys
        _.each(_.sortBy(_.keys(data[k][k1])), function (k2) {
          seal += data[k][k1][k2];
        });
      }
    });
  });

  // retrieve hashMac
  var hmac = crypto.createHmac('sha256', secretKey);

  // set data to create Hmac
  hmac.update(new Buffer(seal, 'utf8'));

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
