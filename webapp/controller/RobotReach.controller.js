sap.ui.define([
	"sap/i2d/lo/lib/vchclf/api/valuation/controller/CustomCharacteristicGroupBase.controller",
	"sap/ui/core/Fragment"
], function (CustomCharacteristicGroupBase, Fragment) {
	"use strict";

	/**
     * Sample Controller implementation for Robot Reach View
     *
     * @public
     * @author I517211
     * @since 1.0.0
     * @extends module:sap/i2d/lo/lib/vchclf/api/valuation/controller/CustomCharacteristicGroupBase
     * 
	 * @module z/vc/ui/ext/controller/RobotReach
     */
	return CustomCharacteristicGroupBase.extend("z.vc.ui.ext.controller.RobotReach", {
		
		/**
		 * Shows an assignment summary dialog
		 * @param {sap.ui.base.Event} oEvent 
		 */
		onPressShowSummary: function(oEvent) {
			var oPromise;
			var oView = this.getView();
			if (!this._oDialog) {
				oPromise = Fragment.load({
					id: oView.getId(),
					name: "z.vc.ui.ext.view.fragment.robotReachSummaryDialog",
					controller: this
				});
				oPromise.then(function (oDialog){
					oView.addDependent(oDialog);
					this._oDialog = oDialog;
				}.bind(this));
			} else {
				oPromise = Promise.resolve(this._oDialog);
			}
			oPromise.then(function (oDialog) {
				oDialog.open();
			});
		},
		
		/**
		 * Closes the assignment summry dialog
		 * @param {sap.ui.base.Event} oEvent 
		 */
		onPressDialogClose: function(oEvent) {
			this._oDialog.close();
		}
		
	});
});