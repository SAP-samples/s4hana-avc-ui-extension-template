/*
 * ${copyright}
 */

sap.ui.define([
	"sap/i2d/lo/lib/vchclf/api/valuation/control/CharacteristicContextContainer",
	"sap/i2d/lo/lib/vchclf/api/valuation/control/Characteristic"
], function (CharacteristicContextContainer, Characteristic) {
	"use strict";

	/**
     * Represents a Standard Characteristic within a VC UI Extension view. This means it leverages the complete infrastructure and behaves in the same
	 * way as in a 'standard' Characteristic Group except that it can be freely placed. Therefore event handling and all other relevant bindings are automatically
	 * managed. The inherited aggregation <code>content</code> serves the stanard Characteristic control and must therefore not be used. Note that for each Characteristic whithin a Characteristic Group there can be only one occurence of a Standard Characteristic. This limitation does
	 * not exist for Custom Characteristic controls {@link module:sap/i2d/lo/lib/vchclf/api/valuation/control/CustomCharacteristic}.
	 *
     * @public
     * @since 1.0.0
     * @extends module:sap/i2d/lo/lib/vchclf/api/valuation/control/CharacteristicContextContainer
     * 
	 * @module sap/i2d/lo/lib/vchclf/api/valuation/control/StandardCharacteristic
     */
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