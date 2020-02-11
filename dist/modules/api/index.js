/* yocto-atos - Yocto module to make payment with Atos - Wrapper for Sips Office Json Interface - V1.2.0 */
"use strict";function ApiRequest(a){this.logger=a}var logger=require("yocto-logger"),_=require("lodash"),Q=require("q"),utils=require("yocto-utils"),request=require("request");ApiRequest.prototype.prepare=function(a,b,c){try{c=c||!1;var d=require("../utils")(this.logger),e=_.find(a.shops,{merchantId:b.merchantId});if(_.isUndefined(e)||_.isEmpty(e))throw"Config was not found for the shop with merchantId : "+b.merchantId+" so the request will not be sent";return b=_.merge(b,e.config),c&&delete b.currencyCode,b.seal=d.calculSEAL(b,e.secretKey),b}catch(f){return this.logger.error("[ YoctoAtos.ApiRequest.prepare ] - an error occured : "+f),f}},ApiRequest.prototype.process=function(a,b,c,d,e,f){var g=Q.defer();try{var h=require("./responseCode.json")}catch(i){this.logger.warning("[ YoctoAtos.ApiRequest.process ] - the responseCode file was not found so the error code will not be translate - more details : "+utils.obj.inspect(i))}e=!!_.isUndefined(e)||e;var j=a.host+"/"+b;return c=this.prepare(a,c,f),_.isObject(c)?(this.logger.debug(["[ YoctoAtos.ApiRequest.process ] - Processing a POST request to :",j,"with data : ",e?utils.obj.inspect(c):"data not allowed to be displayed"].join(" ")),request({json:!0,method:"POST",uri:j,body:c},function(a,b,c){if(this.logger.debug(["[ YoctoAtos.ApiRequest.process ] -","Receiving response with data below :",_.isUndefined(c)?"":utils.obj.inspect(c)].join(" ")),!a&&b&&_.has(b,"statusCode")&&200===b.statusCode&&"00"===c.responseCode)g.resolve(c);else{if(_.isUndefined(c)||_.isUndefined(c.responseCode))a=a||[b.statusCode||"Cannot find request status message",b.statusMessage||"Cannot find request message"].join(" ");else{var d=_.find(h.responseCode,{code:c.responseCode});a=_.merge(c,_.isUndefined(d)?{}:{responseCodeTranslate:d.description})}this.logger.error(["[ YoctoAtos.ApiRequest.process ] - Http request error :",utils.obj.inspect(a)].join(" ")),g.reject(a)}}.bind(this))):(this.logger.error(["[ YoctoAtos.ApiRequest.process ] - Cannot process request for",d,"method.","Cannot prepare data with given value :",e?utils.obj.inspect(c):"data not allow to be displayed"].join(" ")),g.reject(c)),g.promise},module.exports=function(a){return(_.isUndefined(a)||_.isNull(a))&&(logger.warning(["[ YoctoAtos.ApiRequest.constructor ] -","Invalid logger given. Use internal logger"].join(" ")),a=logger),new ApiRequest(a)};