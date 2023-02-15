/*
 * ${copyright}
 */

sap.ui.define([
	"sap/m/FlexBox",
	"sap/m/FlexBoxRenderer",
	"sap/m/Input",
	"sap/m/MultiInput",
	"sap/m/Column",
	"sap/m/ColumnListItem",
	"sap/m/Token",
	"sap/m/Select",
	"sap/m/Label",
	"sap/ui/core/Item",
	"sap/ui/core/Component"
	], function (FlexBox, FlexBoxRenderer, Input, MultiInput, Column, ColumnListItem, Token, Select, Label, Item, Component) {
	"use strict";

	/**
     * This class represents the origin characteristic implementation in the mock launcher
	 * 
     * @extends module:sap/i2d/lo/lib/vchclf/api/valuation/control/CharacteristicContextContainer
     * @ignore
     */
	return FlexBox.extend("sap.i2d.lo.lib.vchclf.api.valuation.control.Characteristic", {
		
		constructor: function (mSettings) {
			mSettings.direction = "Column";
			mSettings.fitContainer = true;
			mSettings.justifyContent = "End";
			mSettings.width = "100%";
			FlexBox.prototype.constructor.apply(this, [mSettings]);
			this.addStyleClass("sapVchclfCsticFlexBox");
			this._oLabelAndInconsistencyIconFlexBox = new FlexBox({
				fitContainer: true,
				alignItems: "Start",
				justifyContent: "SpaceBetween"
			});
			this._oLabelAndInconsistencyIconFlexBox.addItem(new Label({
				text: "{view>Description}"
			}));	
		},
		
		renderer: function (oRm, oControl) {
			return FlexBoxRenderer.render(oRm, oControl);
		},
		
		propagateProperties: function() {
			FlexBox.prototype.propagateProperties.apply(this, arguments);
			if (!this._oTypeControl && this.getBindingContext("view") && this.getBindingContext("view").getPath().endsWith(this.getParent().getName())) {
				var oContext = this.getBindingContext("view");
				var oCstic = oContext.getObject();
				if (oCstic.IsSingleValued) {
					if (oCstic.DomainValues && oCstic.DomainValues.length > 0) {
						this._oTypeControl = new Select({
							width: "100%",
							items: {
								path: "view>DomainValues",
								template: new Item({
									key: "{view>TechnicalValue}",
									text: "{view>Description}"
								})
							},
							change: [this.onSelectChange, this]
						});
					} else {
						this._oTypeControl = new Input({
							change: [this.onInputValueChange, this]
						});
					}
				} else {
					this._oTypeControl = new MultiInput({
						tokenUpdate: [this.onMultiInputTokenUpdate, this],
						showSuggestion: true,
						showValueHelp: false,
						suggestionRows: {
							path: "view>DomainValues",
							template: new ColumnListItem({
								cells: [
									new Label({text: "{view>TechnicalValue}"}),
									new Label({text: "{view>Description}"})
								]	
							})
						},
			            suggestionColumns: [
							new Column({
								hAlign: "Begin",
								popinDisplay: "Inline",
								demandPopin: true,
								header: new Label({text: "Technical Value"})
							}),
							new Column({
								hAlign: "Center",
								popinDisplay: "Inline",
								demandPopin: true,
								header: new Label({text: "Description"})
							})
						],
						tokens: {
							path: "view>AssignedValues",
							template: new Token({
								key: "{view>TechnicalValue}",
								text: "{view>Description}"	
							})
						}
					});
					this._oTypeControl.addValidator(function(args) {
						if (args.suggestionObject) {
							var key = args.suggestionObject.getCells()[0].getText();
							var text = args.suggestionObject.getCells()[1].getText();
		
							return new Token({key: key, text: text});
						}
						return null;
					});
				}
				this.addItem(this._oLabelAndInconsistencyIconFlexBox);
				this.addItem(this._oTypeControl);
			}
		},
		
		onSelectChange: function(oEvent) {
			var oValue = oEvent.getParameter("selectedItem").getBindingContext("view").getObject();
			
			var oCtx = oEvent.getSource().getBindingContext("view");
			var oCstic = oCtx.getObject();
			
			this._getOwnerComponent(oEvent.getSource()).applyTechnicalValues(this.getModel("view"), oCstic, [oValue.TechnicalValue]);
		},
		
		onInputValueChange: function(oEvent) {
			var sValue = oEvent.getParameter("newValue");
			
			var oCtx = oEvent.getSource().getBindingContext("view");
			var oCstic = oCtx.getObject();
			
			this._getOwnerComponent(oEvent.getSource()).applyTechnicalValues(this.getModel("view"), oCstic, [sValue]);
		},
		
		onMultiInputTokenUpdate: function(oEvent) {
			var oCtx = oEvent.getSource().getBindingContext("view");
			var oCstic = oCtx.getObject();
			
			var aAddedTokens = oEvent.getParameter("addedTokens");
			var aRemovedTokens = oEvent.getParameter("removedTokens");
			
			var aAssignedValues = oCstic.AssignedValues;
			var aResult = [];
			for (var i=0; i < aAssignedValues.length; i++) {
				if (aRemovedTokens.findIndex(function(oToken) {
					return oToken.getKey() === aAssignedValues[i].TechnicalValue;
				}) === -1) {
					aResult.push(aAssignedValues[i].TechnicalValue);
				}
			}
			aAddedTokens.forEach(function(oToken) {
				aResult.push(oToken.getKey());
			});
			
			this._getOwnerComponent(oEvent.getSource()).applyTechnicalValues(this.getModel("view"), oCstic, aResult);
		},
		
		_getOwnerComponent: function(oControl) {
			while (oControl) {
				if (oControl instanceof Component) {
					return oControl;
				} else {
					oControl = oControl.getParent();
				}
			}
			return null;
		}
		
	});
	
});