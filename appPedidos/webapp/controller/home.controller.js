sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
    "sap/ui/model/json/JSONModel",
    "../utils/odataAPI"
],
	/**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller, Filter, FilterOperator, JSONModel, odataAPI) {
        "use strict";

        return Controller.extend("ns.appPedidos.controller.home", {

            getOdataModel: function () {
                if (!this._odata) {
                    //	this._odata = new odataAPI(this.getModel("service"));
                    this._odata = new odataAPI(this.getView().getModel("servicio"));
                }
                return this._odata;
            },

            onClientSelect: function(oEvent) {
                debugger;
            },

            // búsqueda de clientes
            onSearchClientes: function (oEvent) {
                var sQuery = oEvent.getParameter("query");
                if (sQuery) {

                    var aFilter = new Filter({
                        filters: [
                            new Filter("NAME1", FilterOperator.Contains, sQuery),
                            new Filter("KUNNR", FilterOperator.Contains, sQuery),
                            new Filter("SORTL", FilterOperator.Contains, sQuery)
                        ],
                        and: false
                    })
                }

                // filter binding
                var oList = this.getView().byId("idClientesTable");
                var oBinding = oList.getBinding("items");
                oBinding.filter(aFilter);
            },

            // Evento para radio button.
            onRadioSelect: function (oEvent) {
                var oTemplate = {
                    "Movilidad": '1000',
                    "Repuestos y Accesorios": "2000"
                }
                // debugger
                var sRbSelected = oEvent.oSource.getSelectedButton().getText()
                var sParam = oTemplate[sRbSelected]
                this.getView().getModel('tipoVenta').setProperty('/rbParam', sParam)
                this.getView().getModel('homeView').setProperty('/busy', true)
                this._callCliente()
            },

            _callCliente: async function (oEvent) {
                var aFilters = [];
                var sRb = this.getView().getModel('tipoVenta').getProperty('/rbParam')
                aFilters.push(new Filter("VKORG", FilterOperator.EQ, sRb));
                aFilters.push(new Filter("VTWEG", FilterOperator.EQ, "10"));
                aFilters.push(new Filter("SPART", FilterOperator.EQ, "11"));
                aFilters.push(new Filter("ZMAIL", FilterOperator.EQ, "BMUNOZ@AUTECOMOBILITY.COM"));

                var param = {
                    filters: aFilters
                }

                var oRequest = this.getOdataModel().read('/DestinatariosSet', param)
                await oRequest.then(function (response) {
                    if (response) {
                        this.getView().getModel('clientes').setProperty('/', JSON.parse(response.body).d)
                    }
                    this.getView().getModel('homeView').setProperty('/busy', false)
                }.bind(this))

            },

            onInit: function () {

                var busyModel = new JSONModel({
                    busy: true,
                    delay: 0
                })
                this.getView().setModel(busyModel, 'homeView')

                var oModelRb = new JSONModel({
                    rbParam: "1000"
                })
                //obtengo la vista y la asocio al modelo por la variable .     
                this.getView().setModel(oModelRb, "tipoVenta")

                // Create a JSON model from an object literal
                var oModel = new JSONModel({
                    codCliente: ""
                });
                //obtengo la vista y la asocio al modelo por la variable .     
                this.getView().setModel(oModel, "pedidos")

                var oModelClientes = new JSONModel({

                })

                //obtengo la vista y la asocio al modelo por la variable .     
                this.getView().setModel(oModelClientes, "clientes")


                // var callVentas = this.getOdataModel().read('/OrgVentasSet')

                // callVentas.then(function (response) {
                //     v_vkorg = response.results[0].Vkorg
                //     this.getView().getModel('pedidos').setProperty('/codCliente', v_vkorg)
                // }.bind(this))



                // Destinatarios
                this._callCliente()




                // debugger
                // fin destinatarios	                

            }
        });
    });
