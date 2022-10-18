sap.ui.define([
	"sap/i2d/lo/lib/vchclf/api/valuation/controller/CustomCharacteristicGroupBase.controller",
	"sap/ui/core/Fragment"
], function (CustomCharacteristicGroupBase, Fragment) {
	"use strict";

	/**
     * Sample Controller implementation for Robot Common Data View
     *
     * @public
     * @author I517211
     * @since 1.0.0
     * @extends module:sap/i2d/lo/lib/vchclf/api/valuation/controller/CustomCharacteristicGroupBase
     * 
	 * @module z/vc/ui/ext/controller/RobotCommonData
     */
	return CustomCharacteristicGroupBase.extend("z.vc.ui.ext.controller.RobotCommonData", {
		
		/**
		 * Launches a value help dialog for the corresponding Characteristic
		 * @param {sap.ui.base.Event} oEvent 
		 */
		onValueHelpRequest: function(oEvent) {
			this.oButton = oEvent.getSource();
			var oCsticContextContainerControl = this.getCharacteristicContextContainer(this.oButton);
			var oCsticContext = oEvent.getSource().getBindingContext("view")
			var oView = this.getView();

			var oPromise;
			if (!this._oValueHelpDialog) {
				oPromise = Fragment.load({
					id: oView.getId(),
					name: "z.vc.ui.ext.view.fragment.valueHelpDialogWithImage",
					controller: this
				});
				oPromise.then(function (oValueHelpDialog){
					oView.addDependent(oValueHelpDialog);
					this._oValueHelpDialog = oValueHelpDialog;
				}.bind(this));
			} else {
				oPromise = Promise.resolve(this._oValueHelpDialog);
			}
			oPromise.then(function(oValueHelpDialog) {
				oValueHelpDialog.setBindingContext(oCsticContext, "view");
				oValueHelpDialog.open();
				oValueHelpDialog.setBusy(true);
				this._oCharacteristicGroupClientObject.loadDomainValues(oCsticContextContainerControl).finally(function() {
					oValueHelpDialog.setBusy(false);
				});
			}.bind(this));
		},
		
		/**
		 * Closes the currently open value help dialog
		 * @param {sap.ui.base.Event} oEvent 
		 */
		onValueHelpDialogClose: function(oEvent) {
			var oSelectedItem = oEvent.getParameter("selectedItem");
			if (oSelectedItem) {
				var oValue = oSelectedItem.getBindingContext("view").getObject();
				var oCsticContextContainerControl = this.getCharacteristicContextContainer(this.oButton);
				this._oCharacteristicGroupClientObject.applyValues(oCsticContextContainerControl, [oValue.TechnicalValue]);
			}
		}
		
	});
});