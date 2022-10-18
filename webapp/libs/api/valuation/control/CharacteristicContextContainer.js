/*
 * ${copyright}
 */

sap.ui.define([
	"sap/ui/core/Control"
], function (Control) {
	"use strict";

	return Control.extend("sap.i2d.lo.lib.vchclf.api.valuation.control.CharacteristicContextContainer", {
		metadata: {
			
			aggregations: {
			   "content": {singularName: "content", multiple: false} // default type is "sap.ui.core.Control"
			
			},
			defaultAggregation: "content",
			
			properties: {
				name: {
					type: "string"
				},
				loadDomainValues: {
					type: "boolean",
					default: false
				},
				removeNoneValue: {
					type: "boolean",
					default: false
				},
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