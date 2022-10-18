sap.ui.define([
        "sap/ui/core/UIComponent",
        "sap/ui/Device",
        "sap/i2d/lo/lib/vchclf/api/launcher/model/models",
        "sap/ui/model/json/JSONModel",
        "sap/ui/base/Event",
        "sap/ui/core/mvc/XMLView"
    ],
    function (UIComponent, Device, models, JSONModel, Event, XMLView) {
        "use strict";

        return UIComponent.extend("z.vc.ui.ext.Component", {
            metadata: {
                manifest: "json"
            },

            /**
             * The component is initialized by UI5 automatically during the startup of the app and calls the init method once.
             * @public
             * @override
             */
            init: function () {
                // call the base component's init function
                UIComponent.prototype.init.apply(this, arguments);

                // enable routing
                this.getRouter().initialize();
                
                this.getRouter().attachRouteMatched(this.onRouteMatched, this);
                
                // when coming from deep url
                var sHash = this.getRouter().getHashChanger().getHash();
				var oRoute = this.getRouter().getRouteInfoByHash(sHash);
				if (oRoute) {
					this.onRouteMatched(new Event("routeMatched", this, {name: oRoute.name}))
				}

                // set the device model
                this.setModel(models.createDeviceModel(), "device");
            },
            
            onRouteMatched: function(oEvent) {
				var sTargetName = oEvent.getParameter("name");
				if (sTargetName !== "Selector") {	
					var mTargets = this.getManifest()["sap.ui5"].routing.targets;
					var oTarget = mTargets[sTargetName];
					
					var oResult = this.getRouter().getView(oTarget.viewName,oTarget.viewType);
					var oPromise;
					if (oResult instanceof XMLView) {
						oPromise = Promise.resolve(oResult);
					} else {
						oPromise = oResult;
					}
					oPromise.then(function(oView) {
						if (!oView.getModel("view")) {
							// instantiate the mock data model as given in manifest
							var sUrl = sap.ui.require.toUrl("z/vc/ui/ext/" + oTarget.mockData);
							var oModel = new JSONModel(sUrl);
							oView.setModel(oModel, "view");
							
							var oCtx = oModel.createBindingContext("/");	
							oView.setBindingContext(oCtx, "view");
							
							this.oCurrentView = oView;
							
							oView.getController().initCharacteristicGroupClientObject(oModel);
							oView.getController().beforeRefresh();
						}
						
					}.bind(this));
					
				}
			},
			
			applyTechnicalValues: function(oModel, oCstic, aTechnicalValues) {
				var aAssignedValues = [];
				for (var i=0; i < oCstic.DomainValues.length; i++) {
					if (aTechnicalValues.findIndex(function(oEl) {
						return oEl === oCstic.DomainValues[i].TechnicalValue
					}) > -1) {
						oCstic.DomainValues[i].IsSelected = true;
						aAssignedValues.push(oCstic.DomainValues[i]);
					} else {
						oCstic.DomainValues[i].IsSelected = false;
					}
				}
				if (aAssignedValues.length === 0) {
					aTechnicalValues.forEach(function(sTechnicalValue, index) {
						aAssignedValues.push({
							TechnicalValue: sTechnicalValue+"",
							Description: sTechnicalValue+"",
							CsticId: oCstic.CsticId,
							IsSelected: true,
							IsDefaultValue: false,
							ValueId: index+1+""
						});
					});
				}
				oCstic.AssignedValues = aAssignedValues;
				oModel.setProperty("/"+ oCstic.Name + "/", oCstic);
				this.oCurrentView.getController().beforeRefresh();
			}
        });
    }
);