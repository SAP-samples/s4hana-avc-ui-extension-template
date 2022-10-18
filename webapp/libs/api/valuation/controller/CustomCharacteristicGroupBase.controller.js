sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/i2d/lo/lib/vchclf/api/valuation/CustomDataConstants",
	"sap/i2d/lo/lib/vchclf/api/valuation/CharacteristicGroupClientObject",
	"sap/i2d/lo/lib/vchclf/api/valuation/control/CharacteristicContextContainer",
	"sap/base/strings/formatMessage"
], function (Controller, CustomDataConstants, CharacteristicGroupClientObject, CharacteristicContextContainer, formatMessage) {
	"use strict";

	return Controller.extend("sap.i2d.lo.lib.vchclf.api.valuation.controller.CustomCharacteristicGroupBase", {
		
		initCharacteristicGroupClientObject: function(oModel) {
			this.setCharacteristicGroupClientObject(new CharacteristicGroupClientObject(this.getOwnerComponent(), oModel, this._getNamespace()));
		},
		
		setCharacteristicGroupClientObject: function(oCharacteristicGroupClientObject) {
			this._oCharacteristicGroupClientObject = oCharacteristicGroupClientObject;
		},
		
		getCharacteristicGroupClientObject: function() {
			return this._oCharacteristicGroupClientObject;
		},
		
		onShowInInspectorByCharcContext: function(oEvent) {
			var oContextContainerControl = this.getCharacteristicContextContainer(oEvent.getSource());		
			if (oContextContainerControl) {
				this._oCharacteristicGroupClientObject.selectCharacteristic(oContextContainerControl.getName());
			}
		},
		
		onApplyByValueContext: function(oEvent) {	
			var oContext = oEvent.getSource().getBindingContext("view");
			if (oContext && oContext.getObject() && oContext.getObject().ValueId) {
				var sEventParameterCondition = oEvent.getSource().data(CustomDataConstants.EVENT_PARAMETER_CONDITION);
				var aConditionsParts = sEventParameterCondition ? sEventParameterCondition.split("="): null;
				if (aConditionsParts===null || aConditionsParts.length === 2 && oEvent.getParameter(aConditionsParts[0])+"" === aConditionsParts[1]) {
					var oValue = oContext.getObject();		
					var sAction = oEvent.getSource().data(CustomDataConstants.ACTION);
					if (sAction) {
						var oContextContainerControl = this.getCharacteristicContextContainer(oEvent.getSource());
						// if no control is found -> an error is already logged
						if (oContextContainerControl) {
							var aTechnicalValues;
							
							var oCstic = oContextContainerControl.getBindingContext("view").getObject();
						
							if (sAction === CustomDataConstants.ACTION_ENUM.SELECT) {
								if (oCstic.IsSingleValued) {
									aTechnicalValues = [oValue.TechnicalValue];
								} else {
									aTechnicalValues = oCstic.AssignedValues.map(function(oAssignedValue) {
										return oAssignedValue.TechnicalValue;
									});
									// add the technical value of the not yet selected one
									aTechnicalValues.push(oValue.TechnicalValue);
								}
							} else if (sAction === CustomDataConstants.ACTION_ENUM.DESELECT) {
								if (oCstic.IsSingleValued) {
									aTechnicalValues = [""];
								} else {
									aTechnicalValues = [];
									// get technical values of all assigned but not the deselected one
									oCstic.AssignedValues.forEach(function(oAssignedValue) {
										if (oAssignedValue.TechnicalValue !== oValue.TechnicalValue) {
											aTechnicalValues.push(oAssignedValue.TechnicalValue);
										}
									});
								}
							} else {
								console.error(formatMessage("Supplied value '{0}' is not valid for sap.ui.core.CustomData with key '", [CustomDataConstants.ACTION]));
							}
							
							this._oCharacteristicGroupClientObject.applyValues(oContextContainerControl, aTechnicalValues);
						}	
					} else {
						console.error(formatMessage("The 'onApplyByValueContext' function requires sap.ui.core.CustomData with key '{0}'.", [CustomDataConstants.ACTION]));
					}
				}
			} else {
				console.error(formatMessage("The 'onApplyByValueContext' function can only be called from a template control which is used for an aggregation bound to Characteristic DomainValues. The layout control to which the aggregation belongs must be a child of a CharacteristicContextContainer.", [] ));
			}
		},
		
		onApplyByCharcContext: function(oEvent) {
			var sEventParameter = oEvent.getSource().data(CustomDataConstants.EVENT_PARAMETER);
			var inputValue = "";
			if (sEventParameter) {
				inputValue = oEvent.getParameter(sEventParameter);
			} else {
				console.error(formatMessage("The 'onApplyByCharcContext' function requires sap.ui.core.CustomData with key '{0}'.", [CustomDataConstants.EVENT_PARAMETER]));
			}
			
			var oContextContainerControl = this.getCharacteristicContextContainer(oEvent.getSource());	
			if (oContextContainerControl) {		
				this._oCharacteristicGroupClientObject.applyValues(oContextContainerControl, [inputValue]);
			}
		},
		
		onApplyDefaultsByCharcContext: function(oEvent) {			
			var oContextContainerControl = this.getCharacteristicContextContainer(oEvent.getSource());	
			if (oContextContainerControl) {
				this._oCharacteristicGroupClientObject.applyDefaultValues(oContextContainerControl);
			}
		},
		
		beforeRefresh: function() {
			
		},
		
		getCharacteristicContextContainer: function(oControl) {
			var oParam = oControl;
			while (oControl) {
				if (oControl instanceof CharacteristicContextContainer) {
					return oControl;	
				} else {
					oControl = oControl.getParent();
				}
			}
			console.error(formatMessage("No CharacteristicContextContainer control found when traversing up from control '{0}'.", [oParam.getId()]));
			return null;
		},
		
		getCharacteristicRootControl: function(oControl, sEventHandlerName) {
			var oParam = oControl;
			var oData;
			
			// bubble up to the control which has the Characteristic Context
			while (oControl) {
				oData = oControl.getBindingContext("view").getObject();
				if (oData && oData.__metadata.type.indexOf('Characteristic') === oData.__metadata.type.length - 'Characteristic'.length) {
					return oControl;	
				} else {
					oControl = oControl.getParent ? oControl.getParent(): null;
				}
			}
			console.error(formatMessage("No characteristic root control found when traversing up from control '{0}'. The event handler '{1}' can only be used within a CharacteristicContextContainer control.", [oParam.getId(), sEventHandlerName]));
			return null;
		},
		
		_getCsticData: function(sCsticId) {
			var oData = this.getView().getModel("view").getData();
			var mCstics = oData.Characteristics;
			for (var prop in mCstics) {
				if (mCstics[prop].CsticId === sCsticId) {
					return mCstics[prop];
				}
			}
			throw Error("No Characteristic found for CsticId '"+ sCsticId + "''");
		},
		
		_getNamespace: function() {
			var sViewName = this.getView().getViewName();
			var aParts = sViewName.split(".");
			var sNamespace = "";
			for (var i=0; i < aParts.length; i++) {
				if (aParts[i] !== "view") {
					if (sNamespace !== "") {
						sNamespace += "/";
					}
					sNamespace += aParts[i];	
				} else {
					break;	
				}
			}
			return sNamespace;
		},
		
		_getResourceUrl: function(sPath) {
			if (sPath.charAt(0) !== "/") {
				sPath = "/" + sPath;  
			}
			return sap.ui.require.toUrl(this._getNamespace() + sPath);
		},
		
		formatter: {
			
			getNumericFieldOfFirstValue: function(aValues, sFieldName)  {
				if (aValues && aValues.length > 0) {
					var oValue = aValues[0].ValueId !== "" ? aValues[0] : aValues[1];
					var i = parseInt(oValue[sFieldName],10);
					return isNaN(i) ? 0: i;
				} else {
					return 0;
				}
			},
			
			getNumericFieldOfLastValue: function(aValues, sFieldName)  {
				if (aValues && aValues.length > 0) {
					var oValue = aValues[aValues.length-1];
					var i = parseInt(oValue[sFieldName],10);
					return isNaN(i) ? 0: i;
				} else {
					return 0;
				}
			},
			
			getTextFieldOfFirstValue: function(aValues, sFieldName)  {
				if (aValues && aValues.length > 0) {
					var oValue = aValues[0].ValueId !== "" ? aValues[0] : aValues[1];
					return oValue[sFieldName];
				} else {
					return null;
				}
			},
			
			getTextFieldOfLastValue: function(aValues, sFieldName)  {
				if (aValues && aValues.length > 0) {
					var oValue = aValues[aValues.length-1];
					return oValue[sFieldName];
				} else {
					return null;
				}
			},
			
			getImageResourceUrlForValue: function(oValue, sSuffix) {
				if (oValue && sSuffix) {
					var oCstic = this._getCsticData(oValue.CsticId);
					var sTechnicalValue = oValue.TechnicalValue ? oValue.TechnicalValue : "none";
					return this._getResourceUrl("/img"+ "/" + oCstic.Name + "/" + sTechnicalValue + sSuffix);
				} else {
					return null;
				}
			},
			
			getImageResourceUrl: function(sPath) {
				return this._getResourceUrl(sPath);
			},
			
			getLocalizedTextForValue: function(oValue) {
				var oCstic = this._getCsticData(oValue.CsticId);
				var oRb = this.getView().getModel("customView_i18n").getResourceBundle();
				return oRb.getText(oCstic.Name + "." + oValue.TechnicalValue)
			}
		}	
		
	
	});
});