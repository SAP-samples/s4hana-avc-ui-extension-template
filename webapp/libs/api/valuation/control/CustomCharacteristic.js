/*
 * ${copyright}
 */

sap.ui.define([
	"sap/i2d/lo/lib/vchclf/api/valuation/control/CharacteristicContextContainer"
], function (CharacteristicContextContainer) {
	"use strict";

	/**
     * Represents a Custom Characteristic within a VC UI Extension view. The custom visualization needs to be placed in aggregation <code>content</code> and can make use of available
	 * UI5 or own controls. Each instance has a <code>CharacteristicValueProcessor</code> attached that becomes involved as soon as a value assignment
	 * should be performed. This processor is decoupled from the actual control representation and implictly used when a generic event handler of 
	 * {@link module:sap/i2d/lo/lib/vchclf/api/valuation/controller/CustomCharacteristicGroupBase}
	 * is called.
     *
     * @public
     * @author I517211
     * @since 1.0.0
     * @extends module:sap/i2d/lo/lib/vchclf/api/valuation/control/CharacteristicContextContainer
     * 
	 * @module sap/i2d/lo/lib/vchclf/api/valuation/control/CustomCharacteristic
     */
	return CharacteristicContextContainer.extend("sap.i2d.lo.lib.vchclf.api.valuation.control.CustomCharacteristic", { /** @lends sap.i2d.lo.lib.vchclf.api.valuation.control.CustomCharacteristic.prototype */
		
		renderer: function (oRm, oControl) {
			CharacteristicContextContainer.prototype.getRenderer().render(oRm, oControl);
		}
		
	});
	
});