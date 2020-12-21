sap.ui.define([
    "sap/ui/base/Object"
], function (Object) {
    "use strict";
    return Object.extend("Telecom.zui5altatarjeta.utils.odataAPI", {
         constructor: function (model) {
            this.model = model;
        },
        returnData(resolve, reject, mParameters){
            return {
                parameters : !!mParameters ? mParameters.parameters : '',
                filters: !!mParameters ? mParameters.filters : '',
                sorters: !!mParameters ? mParameters.sorters : '',
                success: function(data,response) {
                    resolve(response);
                },
                error: function(oError) {
                     reject(oError);
                }
            };
        },
        create(sPath, payload){
            return new Promise(function(resolve, reject){
                this.model.create(sPath, payload, this.returnData(resolve, reject));
            }.bind(this));
        },
        read(sPath, mParameters) {
            return new Promise(function (resolve, reject) {
                this.model.read(sPath, this.returnData(resolve, reject, mParameters));
            }.bind(this));
        },
        update(sPath, payload){
            return new Promise(function(resolve, reject){
                this.model.update(sPath, payload, this.returnData(resolve, reject));
            }.bind(this));
        },
        delete(sPath){
            return new Promise(function(resolve, reject){
                this.model.remove(sPath, this.returnData(resolve, reject));
            }.bind(this));
        }
    });
});