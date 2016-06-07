'use strict';

var logger      = require('yocto-logger');
var _           = require('lodash');
var Q           = require('q');
var utils       = require('yocto-utils');
var request     = require('request');

/**
 * Default core class. Prepare / process & send request with given data
 */
function ApiRequest (l) {
  /**
   * Default logger instance
   */
  this.logger   = l;
}

/**
 * Default method to prepare request before orika api call
 *
 * @param {Object} data default data to use on request
 * @param {String} secretKey secretKey to Calcul SEAL
 * @return {Boolean} true if all is ok false otherwise
 */
ApiRequest.prototype.prepare = function (data, secretKey) {
  try {
    var orikaUtils = require('../utils')(this.logger);

    // Calcul hashmac of the request to add into SEAL
    data.seal = orikaUtils.calculSEAL(data, secretKey);

    // return the data to send to ATOS
    return data;
  } catch (error) {
    this.logger.error('[ YoctoAtos.ApiRequest.prepare ] - an error occured : ' + error);
    // default statement
    return !true;
  }
};

/**
 * Default method to process a request on end api
 *
 * @param {String} config config objec with necessary field to make call
 * @param {String} endpoint given endpoint to use
 * @param {Object} data data to send on request
 * @param {String} method Method name that call this process
 * @param {Boolean} showDataLog optional parameter to disable log of the querry
 * @return {Object} default promise to use on the end of request
 */
ApiRequest.prototype.process = function (config, endpoint, data, method, showDataLog) {
  // create async process
  var deferred = Q.defer();

  try {
    // retrieve response code
    var responseCode = require('./responseCode.json');
  } catch (error) {
    this.logger.warning('[ YoctoAtos.ApiRequest.process ] - the responseCode file was not found' +
    ' so the error code will not be translate - more details : ' + utils.obj.inspect(error));
  }

  // override value if not defined
  showDataLog = _.isUndefined(showDataLog) ? true : showDataLog;

  // normalize host
  var host = config.host + '/' + endpoint;

  // default merged data to use
  data = this.prepare(_.merge(_.clone(config.config), data), config.secretKey);

  // prepare request
  if (_.isObject(data)) {
    // debug message
    this.logger.debug([ '[ YoctoAtos.ApiRequest.process ] - Processing a POST request to :',
                         host, 'with data : ', showDataLog ? utils.obj.inspect(data) :
                         'data not allow to be displayed' ].join(' '));
    // process request
    request({
      json    : true,
      method  : 'POST',
      uri     : host,
      body    : data
    }, function (error, response, body) {

      // log response before validation
      this.logger.debug([ '[ YoctoAtos.ApiRequest.process ] -',
                          'Receiving response with data below :',
                          (!_.isUndefined(body) ? utils.obj.inspect(body) : '') ].join(' '));

      // add test to check if all is ok for next process
      if (!error && response && _.has(response, 'statusCode') && response.statusCode === 200 &&
      body.responseCode === '00') {

        // return with correct data
        deferred.resolve(body);
      } else {

        // check id responseCode was defined
        if (!_.isUndefined(body) && !_.isUndefined(body.responseCode)) {

          // retrieve the Translation of error code
          var translateCode = _.find(responseCode.error, { responseCode : body.responseCode });

          // merge the error code
          error = _.merge(body, _.isUndefined(translateCode) ? {} : translateCode);
        } else {

          // normalize error
          error = error || [
            response.statusCode     || 'Cannot find request status message',
            response.statusMessage  || 'Cannot find request message',
          ].join(' ');
        }

        // log message
        this.logger.error([ '[ YoctoAtos.ApiRequest.process ] - Http request error :',
                            error ].join(' '));
        // reject with data
        deferred.reject(error);
      }
    }.bind(this));
  } else {
    // log error
    this.logger.error([ '[ YoctoAtos.ApiRequest.process ] - Cannot process request for', method,
                        'method.', 'Cannot prepare data with given value :',
                        utils.obj.inspect(_.values(arguments))
                      ].join(' '));
    // reject
    deferred.reject();
  }

  // default statement
  return deferred.promise;
};

// Default export
module.exports = function (l) {
  // is a valid logger ?
  if (_.isUndefined(l) || _.isNull(l)) {
    // warning message
    logger.warning([ '[ YoctoAtos.ApiRequest.constructor ] -',
                     'Invalid logger given. Use internal logger' ].join(' '));
    // assign
    l = logger;
  }

  // default statement
  return new (ApiRequest)(l);
};
