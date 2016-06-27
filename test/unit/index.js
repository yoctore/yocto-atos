var utils  = require('yocto-utils');
var chai   = require('chai').assert;
var expect = require('chai').expect;
var should = require('chai').should;
var _      = require('lodash');
var atos = require('../../src/')();
var util   = require('util');

atos.logger.enableConsole(false);

var types = [ null, undefined, 1, true, false, NaN, 'a', '', {}, [] ];

var config = {
  mode      : 'sandbox',
  secretKey : 'mykey',
  config    : {
    currencyCode : '978',
    keyVersion   : 1
  }
};

describe('Load config', function () {

  // valid conf
  describe('loadConfig() must return a return success promise : ', function () {
    // test load atos with promised
    it('Use valid configuration', function( ) { // no done

      // note the return
      return atos.loadConfig(config).then(function( data){
        expect(data).to.equal(config);
      });// no catch, it'll figure it out since the promise is rejected
    });
  });

  // wrong conf
  describe('loadConfig() must return a return fail promise because < mode > will not be an ' +
  'valid value : ', function () {

    types.forEach(function (t) {
      it('Using type for : < ' +  util.inspect(t, { depth : null }) + ' > for field < mode >',
      function () {

        var config = {
          mode          : t,
          secretKey : 'mykey',
          config    : {
            currencyCode : '978',
            keyVersion   : 1
          }
        };
        // note the return
        return atos.loadConfig(config).catch(function (data) {
          expect(data).to.be.an('string');
        });// no catch, it'll figure it out since the promise is rejected
      });
    });
  });

  // wrong conf
  describe('loadConfig() must return a return fail promise because < mode > is valid but ' +
  'other value not : ', function () {

    // overide types by removing string value
    var types = [ null, undefined, 1, true, false, NaN, '', {}, [] ];

    types.forEach(function (t) {
      it('Using type for : < ' +  util.inspect(t, { depth : null }) + ' > for field < mode >',
      function () {

        var config = {
          mode          : 'sandbox',
          secretKey : t,
          config    : {
            currencyCode : t,
            keyVersion   : t
          }
        };
        // note the return
        return atos.loadConfig(config).catch(function (data) {
          expect(data).to.be.an('string');
        });// no catch, it'll figure it out since the promise is rejected
      });
    });
  });
});
