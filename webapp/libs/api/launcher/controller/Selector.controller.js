sap.ui.define(
    [
        "sap/ui/core/mvc/Controller",
        "sap/ui/core/CustomData",
        "sap/m/Button"
    ],
    function(BaseController, CustomData, Button) {
      "use strict";
  
      return BaseController.extend("sap.i2d.lo.lib.vchclf.api.launcher.controller.Selector", {
	
        onInit() {
			var mTargets = this.getOwnerComponent().getManifest()["sap.ui5"].routing.targets;
			var oVerticalLayout = this.getView().byId("vLayout");
			for (var sTargetName in mTargets) {
				if (sTargetName !== "Selector") {
					oVerticalLayout.addContent(new Button({
						text: sTargetName + " - " + mTargets[sTargetName].viewName,
						customData: new CustomData({
							key: "targetName",
							value: sTargetName
						}),
						press: [this.onButtonPressed, this]
					}));			
				}
			}
        },
        
        onButtonPressed: function(oEvent) {
			var sTargetName = oEvent.getSource().data("targetName");
			var oRouter = this.getOwnerComponent().getRouter();
			oRouter.navTo(sTargetName);

		}
      });
    }
  );
  