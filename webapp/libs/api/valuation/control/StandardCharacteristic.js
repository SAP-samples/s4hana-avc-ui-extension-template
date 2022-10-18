/*
 * ${copyright}
 */

sap.ui.define([
	"sap/i2d/lo/lib/vchclf/api/valuation/control/CharacteristicContextContainer",
	"sap/i2d/lo/lib/vchclf/api/valuation/control/Characteristic"
], function (CharacteristicContextContainer, Characteristic) {
	"use strict";

	return CharacteristicContextContainer.extend("sap.i2d.lo.lib.vchclf.api.valuation.control.StandardCharacteristic", { /** @lends sap.i2d.lo.lib.vchclf.api.valuation.control.CustomCharacteristic.prototype */
		
		constructor: function (mSettings) {
			mSettings.content = new Characteristic({});
			CharacteristicContextContainer.prototype.constructor.apply(this, [mSettings]);
		},
		
		renderer: function (oRm, oControl) {
			CharacteristicContextContainer.prototype.getRenderer().render(oRm, oControl);
		}
		
	});
	
});