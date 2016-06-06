'use strict';

var _       = require('lodash');
var logger  = require('yocto-logger');
var joi     = require('joi');
var Q       = require('q');
var utils   = require('yocto-utils');

/**
* Yocto Atos : Atos wrapper for Sips Office Json Interface
*
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
   * Default logger
   */
  this.logger = yLogger || logger;
}


// Default export
module.exports = function (l) {
  // is a valid logger ?
  if (_.isUndefined(l) || _.isNull(l)) {
    logger.warning('[ YoctoAtos.constructor ] - Invalid logger given. Use internal logger');
  }

  // assign
  l = logger;

  // default statement
  return new (YoctoAtos)(l);
};
