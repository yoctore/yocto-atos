/* yocto-atos - Yocto module to make payment with Atos - Wrapper for Sips Office Json Interface - V1.0.1 */
"use strict";function ApiRequest(a){this.logger=a}var logger=require("yocto-logger"),_=require("lodash"),Q=require("q"),utils=require("yocto-utils"),request=require("request");ApiRequest.prototype.prepare=function(a,b){try{var c=require("../utils")(this.logger);return a.seal=c.calculSEAL(a,b),a}catch(d){return this.logger.error("[ YoctoAtos.ApiRequest.prepare ] - an error occured : "+d),!1}},ApiRequest.prototype.process=function(a,b,c,d,e){var f=Q.defer();try{var g=require("./responseCode.json")}catch(h){this.logger.warning("[ YoctoAtos.ApiRequest.process ] - the responseCode file was not found so the error code will not be translate - more details : "+utils.obj.inspect(h))}e=!!_.isUndefined(e)||e;var i=a.host+"/"+b;return c=this.prepare(_.merge(_.clone(a.config),c),a.secretKey),_.isObject(c)?(this.logger.debug(["[ YoctoAtos.ApiRequest.process ] - Processing a POST request to :",i,"with data : ",e?utils.obj.inspect(c):"data not allow to be displayed"].join(" ")),request({json:!0,method:"POST",uri:i,body:c},function(a,b,c){if(this.logger.debug(["[ YoctoAtos.ApiRequest.process ] -","Receiving response with data below :",_.isUndefined(c)?"":utils.obj.inspect(c)].join(" ")),!a&&b&&_.has(b,"statusCode")&&200===b.statusCode&&"00"===c.responseCode)f.resolve(c);else{if(_.isUndefined(c)||_.isUndefined(c.responseCode))a=a||[b.statusCode||"Cannot find request status message",b.statusMessage||"Cannot find request message"].join(" ");else{var d=_.find(g.responseCode,{code:c.responseCode});a=_.merge(c,_.isUndefined(d)?{}:{responseCodeTranslate:d.description})}this.logger.error(["[ YoctoAtos.ApiRequest.process ] - Http request error :",utils.obj.inspect(a)].join(" ")),f.reject(a)}}.bind(this))):(this.logger.error(["[ YoctoAtos.ApiRequest.process ] - Cannot process request for",d,"method.","Cannot prepare data with given value :",utils.obj.inspect(_.values(arguments))].join(" ")),f.reject()),f.promise},module.exports=function(a){return(_.isUndefined(a)||_.isNull(a))&&(logger.warning(["[ YoctoAtos.ApiRequest.constructor ] -","Invalid logger given. Use internal logger"].join(" ")),a=logger),new ApiRequest(a)};