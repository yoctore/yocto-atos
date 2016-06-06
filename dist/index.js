/* yocto-atos - Yocto module to make payment with Atos - Wrapper for Sips Office Json Interface - V0.1.0 */
"use strict";function YoctoAtos(a){this.config={},this.enabled=!1,this.logger=a||logger}var _=require("lodash"),logger=require("yocto-logger"),joi=require("joi"),Q=require("q");YoctoAtos.prototype.loadConfig=function(a){var b=Q.defer(),c=joi.object().required().keys({mode:joi.string().required().valid(["sandbox","live"]),secretKey:joi.string().required().empty(),config:joi.object().required().keys({currencyCode:joi.string().required().valid(["032","036","116","124","208","344","356","392","410","484","554","578","702","752","756","826","840","901","949","952","953","978","986"]),interfaceVersion:joi.string().required().empty(),keyVersion:joi.number().integer().required().min(1),merchantId:joi.string().required().empty()})}),d=c.validate(a);return d.error?(this.logger.error("[ YoctoAtos.loadConfig.joi ] - an error occured when loading configuration, more details : "+d.error.toString()),b.reject(d.error.toString()),b.promise):(d.value.host="sandbox"===d.value.mode?"https://office-server.test.sips-atos.com/rs-services/v2":"https://office-server.sips-atos.com/rs-services/v2",this.config=d.value,this.enabled=!0,this.logger.info("[ YoctoAtos.loadConfig ] - YoctoAtos instance was configured"),this.modules={creditCard:require("./modules/creditCard")(this.logger,this.config),utils:require("./modules/utils")(this.logger,this.config)},b.resolve(a),b.promise)},module.exports=function(a){return(_.isUndefined(a)||_.isNull(a))&&(logger.warning("[ YoctoAtos.constructor ] - Invalid logger given. Use internal logger"),a=logger),new YoctoAtos(a)};