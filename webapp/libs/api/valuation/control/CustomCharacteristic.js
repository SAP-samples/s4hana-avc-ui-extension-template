/*
 * ${copyright}
 */

sap.ui.define([
	"sap/i2d/lo/lib/vchclf/api/valuation/control/CharacteristicContextContainer"
], function (CharacteristicContextContainer) {
	"use strict";

	return CharacteristicContextContainer.extend("sap.i2d.lo.lib.vchclf.api.valuation.control.CustomCharacteristic", { /** @lends sap.i2d.lo.lib.vchclf.api.valuation.control.CustomCharacteristic.prototype */
		
		renderer: function (oRm, oControl) {
			CharacteristicContextContainer.prototype.getRenderer().render(oRm, oControl);
		}
		
	});
	
});