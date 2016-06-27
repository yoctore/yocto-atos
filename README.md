[![NPM](https://nodei.co/npm/yocto-atos.png?downloads=true&downloadRank=true&stars=true)](https://nodei.co/npm/yocto-atos/)

![alt text](https://david-dm.org/yoctore/yocto-atos.svg "Dependencies Status")
[![Code Climate](https://codeclimate.com/github/yoctore/yocto-atos/badges/gpa.svg)](https://codeclimate.com/github/yoctore/yocto-atos)
[![Test Coverage](https://codeclimate.com/github/yoctore/yocto-atos/badges/coverage.svg)](https://codeclimate.com/github/yoctore/yocto-atos/coverage)
[![Issue Count](https://codeclimate.com/github/yoctore/yocto-atos/badges/issue_count.svg)](https://codeclimate.com/github/yoctore/yocto-atos)
[![Build Status](https://travis-ci.org/yoctore/yocto-atos.svg?branch=master)](https://travis-ci.org/yoctore/yocto-atos)

## Overview

This module is a part of yocto node modules for NodeJS.

Please see [our NPM repository](https://www.npmjs.com/~yocto) for complete list of available tools (completed day after day).

An utility tool to provide payment via Atos API

## Motivation

After each development, conclusion is the same : we need to create an utility tools with all our utility method to be able to reuse them in other program. That's why we create this utility tools.

*Although this module was completed day after day.*

## How to use
  - First you need to create an Store with Atos, and retrieve <client_id> and <secret_key>

All methods returned promise for success of fail

### Load config

This wrapper use the two mode of Atos : 'sandbox' and 'live'
The module must be loaded like this :

```javascript

var atos = require('yocto-atos')();

atos.loadConfig({
  // "sandbox" or "live"
  mode : 'sandbox',
  secretKey         : '484GEF87A45AEAA87842634A684A354A643541AA',
  config : {
    currencyCode      : '978',
    keyVersion        : 1,
  }
}).then(function (config) {
  console.log('success')
}).catch(function (error) {
  console.log('error : ', error)
});
```

### Create authorization payment

An Atos authorization payment permit you to capture payment during in period of 29 days.
*NB :* Atos will honor the funds for a 6-day period after the basic authorization

#### With credit card

To create payment with an credit card

```javascript
var paymentData = {
  amount                : 123,
  cardNumber            : '559955995599559955',
  cardExpiryDate        : '201905',
  cardCSCValue          : '985',
  merchantId            : '1',
  orderId               : '57358b7fea9d4398641209e5', // optional
  transactionReference  : '57358b7fea9d4398641209e5', // optional
  s10TransactionReference : { // optional
    s10TransactionId      : '777888899445566112233',
    s10TransactionIdDate  : '20050606'
  }
};

atos.modules.creditCard.createAuthorization(paymentData).then(function (config) {
  console.log('success')
}).catch(function (error) {
  console.log('error : ', error)
});
```

### Capture payment

TO capture an payment you should have an valid capture payment. The field "transactionReference" or "s10TransactionReference" should be set.

```javascript
var captureData = {
  operationAmount       : 100,
  merchantId            : '1',
  transactionReference  : '57358b7fea9d4398641209e5',
  s10TransactionReference : {
    s10TransactionId      : '777888899445566112233',
    s10TransactionIdDate  : '20050606'
  }
};

atos.capturePayment(captureData).then(function (config) {
  console.log('success')
}).catch(function (error) {
  console.log('error : ', error)
});
```

### Cancel payment

An payment authorization can be void only if was previously captured and not sent to the bank. The field "transactionReference" or "s10TransactionReference" should be set.

```javascript

var cancelData = {
  transactionReference  : '3aabcedaapfa1f33a00425aa8',
  operationOrigin       : 'my app',
  merchantId            : '1',
  operationAmount       : 974
  s10TransactionReference : {
    s10TransactionId      : '777888899445566112233',
    s10TransactionIdDate  : '20050606'
  }
}

atos.cancelPayment(cancelData).then(function () {
  console.log('success')
}).catch(function (error) {
  console.log('error : ', error)
});
```
