/*
 * ${copyright}
 */

sap.ui.define([
	"sap/ui/core/Control"
], function (Control) {
	"use strict";

	/**
     * Base class for controls bound to a Characteristic Context specified by its name. Child elements need to be placed in the default aggregation <code>content</code>. They automatically
	 * inherit a binding context with the name <code>view</code> which is actually bound to the Characteristic entity specified with property <code>name</code>.
	 * This class must not be used directly. See the sub-classes:
     * {@link module:sap/i2d/lo/lib/vchclf/api/valuation/control/CustomCharacteristic}
	 * and 
	 * {@link module:sap/i2d/lo/lib/vchclf/api/valuation/control/StandardCharacteristic}
     * @public
     * @since 1.0.0
     * @extends sap.ui.core.Control
     * 
	 * @module sap/i2d/lo/lib/vchclf/api/valuation/control/CharacteristicContextContainer
     */
	return Control.extend("sap.i2d.lo.lib.vchclf.api.valuation.control.CharacteristicContextContainer", {
		metadata: {
			
			aggregations: {
				/**
				 * Aggregation - content
				 * @memberOf module:sap/i2d/lo/lib/vchclf/api/valuation/control/CharacteristicContextContainer
				 * @type sap.ui.core.Control
				 * @instance
				 * @since 1.0.0
				 * @public
				 */
			   "content": {singularName: "content", multiple: false} // default type is "sap.ui.core.Control"
			
			},
			defaultAggregation: "content",
			
			properties: {
				/**
				 * Property - Name of the Characteristic that should be displayed
				 * @memberOf module:sap/i2d/lo/lib/vchclf/api/valuation/control/CharacteristicContextContainer
				 * @type string
				 * @instance
				 * @since 1.0.0
				 * @public
				 */
				name: {
					type: "string"
				},
				/**
				 * Property - Whether the container should load Domain Values - optional, default is <code>false</code>
				 * @memberOf module:sap/i2d/lo/lib/vchclf/api/valuation/control/CharacteristicContextContainer
				 * @type boolean
				 * @instance
				 * @since 1.0.0
				 * @public
				 */
				loadDomainValues: {
					type: "boolean",
					default: false
				},
				/**
				 * Property - Whether the 'None' value (to reset an assignment) should be removed from retrieved Domain Values  - optional, default is <code>false</code>
				 * @memberOf module:sap/i2d/lo/lib/vchclf/api/valuation/control/CharacteristicContextContainer
				 * @type boolean
				 * @instance
				 * @since 1.0.0
				 * @public
				 */
				removeNoneValue: {
					type: "boolean",
					default: false
				},
				/**
				 * Property - Whether domain values can be kept in case of a value assignment (performance optimization for independent Characteristics) - optional, default is <code>false</code>
				 * @memberOf module:sap/i2d/lo/lib/vchclf/api/valuation/control/CharacteristicContextContainer
				 * @type boolean
				 * @instance
				 * @since 1.0.0
				 * @public
				 */
				keepDomainValues: {
					type: "boolean",
					default: false
				}
			}
		},
		
		renderer: function (oRm, oControl) {
			oRm.openStart("div", oControl);
			oRm.openEnd();
			oRm.renderControl(oControl.getAggregation("content"));
			oRm.close("div");
		},
		
		propagateProperties: function() {
			Control.prototype.propagateProperties.apply(this, arguments);
			if (this.getModel("view") && this.getBindingContext("view") && !this.getBindingContext("view").getPath().endsWith(this.getName())) {
				this.getModel("view").dataLoaded().then(function() {
					var oCtx = this.getModel("view").createBindingContext("/Characteristics/"+ this.getName());
					this.setBindingContext(oCtx,"view");
				}.bind(this));
			}
		},
		
		_getView: function() {
			var oParent = this;
			while (oParent) {
				if (oParent.getMetadata().getName() === 'sap.ui.core.mvc.XMLView') {
					return oParent;
				} else {
					oParent = oParent.getParent();
				}
			}
			throw Error("View could not be obtained from parent chain.");
		},
			
		
		
	});
	
});