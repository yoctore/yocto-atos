/* yocto-atos - Yocto module to make payment with Atos - Wrapper for Sips Office Json Interface - V1.0.1 */
"use strict";function CreditCard(a,b){this.config=b||{},this.logger=a,this.api=require("../api")(logger)}var _=require("lodash"),logger=require("yocto-logger"),joi=require("joi"),Q=require("q"),utils=require("yocto-utils");CreditCard.prototype.createAuthorization=function(a){var b=Q.defer(),c=joi.object().required().keys({amount:joi.number().integer().required().min(0),captureDay:joi.number().integer().optional().min(0)["default"](6),orderChannel:joi.string().optional()["default"]("INTERNET"),captureMode:joi.string().optional()["default"]("VALIDATION"),paymentPattern:joi.string().optional()["default"]("ONE_SHOT"),cardNumber:joi.string().creditCard().required(),cardExpiryDate:joi.string().required().empty(),cardCSCValue:joi.string().required().empty(),orderId:joi.string().optional().empty(),transactionReference:joi.string().optional().empty(),interfaceVersion:joi.string().optional()["default"]("IR_WS_2.12"),merchantId:joi.number().integer().required().min(0),customerId:joi.string().optional().empty(),customerIpAddress:joi.string().optional().empty(),invoiceReference:joi.string().optional().empty(),transactionOrigin:joi.string().optional().empty(),billingAddress:joi.object().optional().keys({addressAdditional1:joi.string().optional().empty(),addressAdditional2:joi.string().optional().empty(),addressAdditional3:joi.string().optional().empty(),city:joi.string().optional().empty(),company:joi.string().optional().empty(),country:joi.string().optional().length(3),postBox:joi.string().optional().empty(),state:joi.string().optional().empty(),street:joi.string().optional().empty(),streetNumber:joi.string().optional().empty(),zipCode:joi.string().optional().empty()}),billingContact:joi.object().optional().keys({email:joi.string().email().optional().empty(),firstname:joi.string().optional().empty(),gender:joi.string().optional().empty().allow(["M","F"]),lastname:joi.string().optional().empty(),mobile:joi.string().optional().empty(),phone:joi.string().optional().empty(),title:joi.string().optional().empty()}),customerAddress:joi.object().optional().keys({addressAdditional1:joi.string().optional().empty(),addressAdditional2:joi.string().optional().empty(),addressAdditional3:joi.string().optional().empty(),city:joi.string().optional().empty(),company:joi.string().optional().empty(),country:joi.string().optional().length(3),postBox:joi.string().optional().empty(),state:joi.string().optional().empty(),street:joi.string().optional().empty(),streetNumber:joi.string().optional().empty(),zipCode:joi.string().optional().empty()}),customerContact:joi.object().optional().keys({email:joi.string().email().optional().empty(),firstname:joi.string().optional().empty(),gender:joi.string().optional().empty().allow(["M","F"]),lastname:joi.string().optional().empty(),mobile:joi.string().optional().empty(),phone:joi.string().optional().empty(),title:joi.string().optional().empty()}),deliveryAddress:joi.object().optional().keys({addressAdditional1:joi.string().optional().empty(),addressAdditional2:joi.string().optional().empty(),addressAdditional3:joi.string().optional().empty(),city:joi.string().optional().empty(),company:joi.string().optional().empty(),country:joi.string().optional().length(3),postBox:joi.string().optional().empty(),state:joi.string().optional().empty(),street:joi.string().optional().empty(),streetNumber:joi.string().optional().empty(),zipCode:joi.string().optional().empty()}),deliveryContact:joi.object().optional().keys({email:joi.string().email().optional().empty(),firstname:joi.string().optional().empty(),gender:joi.string().optional().empty().allow(["M","F"]),lastname:joi.string().optional().empty(),mobile:joi.string().optional().empty(),phone:joi.string().optional().empty(),title:joi.string().optional().empty()}),shoppingCartDetail:joi.object().optional().keys({shoppingCartTotalAmount:joi.number().integer().optional().min(0),shoppingCartTotalQuantity:joi.number().integer().optional().min(0),shoppingCartTotalTaxAmount:joi.number().integer().optional().min(0),mainProduct:joi.string().optional().empty(),shoppingCartItemList:joi.array().items(joi.object().keys({productUnitTaxAmount:joi.number().optional().min(0),productName:joi.string().optional().empty(),productDescription:joi.string().optional().empty(),productCode:joi.string().optional().empty(),productSKU:joi.string().optional().empty(),productUnitAmount:joi.number().optional().min(0),productQuantity:joi.number().optional().min(0),productTaxRate:joi.number().optional().min(0),productCategory:joi.string().optional().empty()})).optional()}),fraudData:joi.object().optional().keys({allowedCardCountryList:joi.array().optional().items(joi.string().length(3)),allowedIpCountryList:joi.array().optional().items(joi.string().length(3)),bypassCtrlList:joi.array().optional().items(joi.string().empty()),bypassInfoList:joi.string().optional().empty().allow(["IpCountry","Card","All"]),deniedCardCountryList:joi.array().optional().items(joi.string().length(3)),deniedIpCountryList:joi.array().optional().items(joi.string().length(3))})}),d=c.validate(a);return d.error?(this.logger.error("[ YoctoAtos.CreditCard.createAuthorization.joi ] - an error occured schema is not conform, more details : "+utils.obj.inspect(d.error)),b.reject(d.error.toString()),b.promise):(a=d.value,this.logger.debug("[ YoctoAtos.CreditCard.createAuthorization ] - a new request will be send to create authorization payment"),this.api.process(this.config,"checkout/cardOrder",a,"createAuthorization",!1).then(function(a){b.resolve(a)})["catch"](function(a){this.logger.error("[ YoctoAtos.CreditCard.createAuthorization.create ] - the payment was not authorized"),b.reject(a)}.bind(this)),b.promise)},CreditCard.prototype.capturePayment=function(a){var b=Q.defer(),c=joi.object().required().keys({operationAmount:joi.number().integer().required().min(0),transactionReference:joi.string().optional().empty(),merchantId:joi.string().required().empty(),interfaceVersion:joi.string().optional()["default"]("CR_WS_2.12"),operationOrigin:joi.string().optional().empty()}),d=c.validate(a);return d.error?(this.logger.error("[ YoctoAtos.CreditCard.capturePayment.joi ] - an error occured schema is not conform, more details : "+d.error.toString()),b.reject(d.error.toString()),b.promise):(a=d.value,this.logger.debug("[ YoctoAtos.CreditCard.capturePayment ] - a new request will be send to create authorization payment"),this.api.process(this.config,"cashManagement/validate",a,"capturePayment").then(function(a){b.resolve(a)})["catch"](function(a){this.logger.error("[ YoctoAtos.CreditCard.capturePayment ] - the payment was not authorized"),b.reject(a)}.bind(this)),b.promise)},CreditCard.prototype.cancelPayment=function(a){var b=Q.defer(),c=joi.object().required().keys({operationAmount:joi.number().integer().required().min(0),s10TransactionReference:joi.object().optional().keys({s10TransactionId:joi.string().required().empty(),s10TransactionIdDate:joi.string().required().empty()}),merchantId:joi.string().required().empty(),interfaceVersion:joi.string().optional()["default"]("CR_WS_2.12"),transactionReference:joi.string().optional().empty(),operationOrigin:joi.string().optional().empty()}),d=c.validate(a);return d.error?(this.logger.error("[ YoctoAtos.CreditCard.cancelPayment.joi ] - an error occured schema is not conform, more details : "+d.error.toString()),b.reject(d.error.toString()),b.promise):(a=d.value,this.logger.debug("[ YoctoAtos.CreditCard.cancelPayment ] - a new request will be send to create authorization payment"),this.api.process(this.config,"cashManagement/cancel",a,"capturePayment").then(function(a){b.resolve(a)})["catch"](function(a){this.logger.error("[ YoctoAtos.CreditCard.cancelPayment ] - the payment was not authorized"),b.reject(a)}.bind(this)),b.promise)},module.exports=function(a,b){return(_.isUndefined(a)||_.isNull(a))&&(logger.warning("[ CreditCard.constructor ] - Invalid logger given. Use internal logger"),a=logger),new CreditCard(a,b)};