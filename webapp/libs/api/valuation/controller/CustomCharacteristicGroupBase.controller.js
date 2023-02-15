sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/i2d/lo/lib/vchclf/api/valuation/CustomDataConstants",
	"sap/i2d/lo/lib/vchclf/api/valuation/CharacteristicGroupClientObject",
	"sap/i2d/lo/lib/vchclf/api/valuation/control/CharacteristicContextContainer",
	"sap/base/strings/formatMessage"
], function (Controller, CustomDataConstants, CharacteristicGroupClientObject, CharacteristicContextContainer, formatMessage) {
	"use strict";

    /**
     * Base controller for VC UI Extension views
     *
     * <p>Provides generic Formatters and Event Handlers. Any custom controller must be derived from this class.</p>
     *
     * @public
     * @since 1.0.0
     * @extends sap.ui.core.mvc.Controller
     * 
	 * @module sap/i2d/lo/lib/vchclf/api/valuation/controller/CustomCharacteristicGroupBase
     */
	return Controller.extend("sap.i2d.lo.lib.vchclf.api.valuation.controller.CustomCharacteristicGroupBase", {
		
		/**
		 * Initializes the Characteristic Group Client Object for this controller - this function is only called in the mock launcher
		 * @param {sap.ui.model.Model} oModel - the view model
		 * @instance
		 * @ignore
		 */
		initCharacteristicGroupClientObject: function(oModel) {
			this.setCharacteristicGroupClientObject(new CharacteristicGroupClientObject(this.getOwnerComponent(), oModel, this._getNamespace()));
		},
		
		/**
		 * Sets the Characteristic Group Client Object for this controller - this can be used for further initialization in sub-classes
		 * @param {sap.i2d.lo.lib.vchclf.api.valuation.CharacteristicGroupClientObject} oCharacteristicGroupClientObject - the Characteristic Group Client Object
		 * @instance
		 * @public
		 * @since 1.0.0
		 */
		setCharacteristicGroupClientObject: function(oCharacteristicGroupClientObject) {
			this._oCharacteristicGroupClientObject = oCharacteristicGroupClientObject;
		},
		
		/**
		 * Returns the Characteristic Group Client Object
		 * @instance
		 * @public
		 * @since 1.0.0
		 * @returns {sap.i2d.lo.lib.vchclf.api.valuation.CharacteristicGroupClientObject}
		 */
		getCharacteristicGroupClientObject: function() {
			return this._oCharacteristicGroupClientObject;
		},
		
		/**
		 * Generic Event Handler - Switches the inspector to the Characteristic retrieved from the surrounding CustomCharacteristic control.
		 * This event handler can be used on any control bound to a Characteristic object inside a CustomCharacteristic control.
		 * @param {sap.ui.base.Event} oEvent - the event object
		 * @instance
		 * @public
		 * @since 1.0.0
		 */
		onShowInInspectorByCharcContext: function(oEvent) {
			var oContextContainerControl = this.getCharacteristicContextContainer(oEvent.getSource());		
			if (oContextContainerControl) {
				this._oCharacteristicGroupClientObject.selectCharacteristic(oContextContainerControl.getName());
			}
		},
		
		/**
		 * Generic Event Handler - Applies the given value represented by the bound Characteristic Value Object. This event handler can be used on any control
		 * bound to a Characteristic Value object inside a CustomCharacteristic control. It requires a custom data object with key ‘action’ which specifies 
		 * the assignment behaviour (select/deselect of the value). Custom data with key eventParameterCondition can optionally be specified to skip
		 * the event processing if the condition is not fulfilled.
		 * @param {sap.ui.base.Event} oEvent - the event object
		 * @instance
		 * @public
		 * @since 1.0.0
		 */
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
		
		/**
		 * Generic Event Handler - Applies the value retrieved from the event object field specified by custom data with key eventParameter. 
		 * This event handler can be used on any control bound to a Characteristic object inside a CustomCharacteristic control. 
		 * The custom data object with key ‘eventParameter’ is mandatory.
		 * @param {sap.ui.base.Event} oEvent - the event object
		 * @instance
		 * @public
		 * @since 1.0.0
		 */
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
		
		/**
		 * Generic Event Handler - Applies the default values. This event handler can be used on any control bound to a Characteristic object inside a CustomCharacteristic control.
		 * @param {sap.ui.base.Event} oEvent - the event object
		 * @instance
		 * @public
		 * @since 1.0.0
		 */
		onApplyDefaultsByCharcContext: function(oEvent) {			
			var oContextContainerControl = this.getCharacteristicContextContainer(oEvent.getSource());	
			if (oContextContainerControl) {
				this._oCharacteristicGroupClientObject.applyDefaultValues(oContextContainerControl);
			}
		},
		
		/**
		 * Hook method for own refresh activities (in case of unbound visualizations) - this function is called whenever a refresh of the displayed controls is necessary. Reasons are:
		 * After initial loading, after a value assignment, when filters have been applied. Characteristic data can be retrieved via
		 * {@link module:sap/i2d/lo/lib/vchclf/api/valuation/CharacteristicGroupClientObject}
		 * @instance
		 * @public
		 * @since 1.0.0
		 */
		beforeRefresh: function() {
			
		},
		
		/**
		 * Retrieves the CharacteristicContextContainer control for the given child control
		 * @param {sap.ui.core.Control} oControl - the control from which to bubble up
		 * @returns {module:sap/i2d/lo/lib/vchclf/api/valuation/control/CharacteristicContextContainer} 
		 * @instance
		 * @public
		 * @since 1.0.0
		 */
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
		
		/**
		 * Retrieves the Characteristic Root Control (the first parent that is bound to a Characteristic) for the given child control (typically bound to a CharacteristicValue)
		 * @param {sap.ui.core.Control} oControl - the control from which to bubble up
		 * @returns {sap.ui.core.Control}
		 * @instance
		 * @public
		 * @since 1.0.0
		 */
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
		
		/**
		 * Returns the Characteristic data object from the view model for the given characteristic id
		 * @param {string} sCsticId - the characteristic id
		 * @return {Object}
		 * @instance
		 * @ignore
		 * @private
		 */
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
		
		/**
		 * Returns the namespace of the corresponding view
		 * @return {string} the namespace in / notation
		 * @instance
		 * @ignore
		 * @private
		 */
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
		
		/**
		 * Returns the resource URL for the given relative path starting at the project root
		 * @param {string} sPath - relative path starting at the project root 
		 * @return {string} the relative URL on the application server
		 * @instance
		 * @ignore
		 * @private
		 */
		_getResourceUrl: function(sPath) {
			if (sPath.charAt(0) !== "/") {
				sPath = "/" + sPath;  
			}
			return sap.ui.require.toUrl(this._getNamespace() + sPath);
		},
		
		/**
		 * Generic formatters
		 * @exports sap/i2d/lo/lib/vchclf/api/valuation/controller/CustomCharacteristicGroupBase/formatter
		 * @instance
		 * @public
		 * @since 1.0.0
		 */
		formatter: {
			
			/**
			 * Returns the content of the specified field from the first element of	the provided values array as number
			 * @param {object[]} aValues - the values array
			 * @param {string} sFieldName - the field to access
			 * @public
		 	 * @instance
		 	 * @since 1.0.0
			 * @returns {int}
			 */
			getNumericFieldOfFirstValue: function(aValues, sFieldName)  {
				if (aValues && aValues.length > 0) {
					var oValue = aValues[0].ValueId !== "" ? aValues[0] : aValues[1];
					var i = parseInt(oValue[sFieldName],10);
					return isNaN(i) ? 0: i;
				} else {
					return 0;
				}
			},
			
			/**
			 * Returns the content of the specified field from the last element of	the provided values array as number
			 * @param {object[]} aValues - the values array
			 * @param {string} sFieldName - the field to access
			 * @public
		 	 * @instance
		 	 * @since 1.0.0
			 * @returns {int}
			 */
			getNumericFieldOfLastValue: function(aValues, sFieldName)  {
				if (aValues && aValues.length > 0) {
					var oValue = aValues[aValues.length-1];
					var i = parseInt(oValue[sFieldName],10);
					return isNaN(i) ? 0: i;
				} else {
					return 0;
				}
			},
			
			/**
			 * Returns the content of the specified field from the first element of	the provided values array as text
			 * @param {object[]} aValues - the values array
			 * @param {string} sFieldName - the field to access
			 * @returns {string}
			 * @public
		 	 * @instance
		 	 * @since 1.0.0
			 */
			getTextFieldOfFirstValue: function(aValues, sFieldName)  {
				if (aValues && aValues.length > 0) {
					var oValue = aValues[0].ValueId !== "" ? aValues[0] : aValues[1];
					return oValue[sFieldName];
				} else {
					return null;
				}
			},
			
			/**
			 * Returns the content of the specified field from the last element of	the provided values array as text
			 * @param {object[]} aValues - the values array
			 * @param {string} sFieldName - the field to access
			 * @returns {string}
			 * @public
		 	 * @instance
		 	 * @since 1.0.0
			 */
			getTextFieldOfLastValue: function(aValues, sFieldName)  {
				if (aValues && aValues.length > 0) {
					var oValue = aValues[aValues.length-1];
					return oValue[sFieldName];
				} else {
					return null;
				}
			},
			
			/**
			 * Returns a deployment specific relative URL pointing to an image residing in the ‘img’ folder of the project
			 * following this directory conventions:<br>
			 * <code>+ Img</code><br>
			 * <code>..+ [Characteristic Name]</code><br>
			 * <code>....+ [TechnicalValue of Value].[suffix]</code><br>
			 * @param {object} oValue - the value object
			 * @param {string} sSuffix - the suffix to append
			 * @returns {string}
			 * @public
		 	 * @instance
		 	 * @since 1.0.0
			 */
			getImageResourceUrlForValue: function(oValue, sSuffix) {
				if (oValue && sSuffix) {
					var oCstic = this._getCsticData(oValue.CsticId);
					var sTechnicalValue = oValue.TechnicalValue ? oValue.TechnicalValue : "none";
					return this._getResourceUrl("/img"+ "/" + oCstic.Name + "/" + sTechnicalValue + sSuffix);
				} else {
					return null;
				}
			},
			
			/**
			 * Returns a deployment specific URL for the given relative path starting from the project root folder
			 * @param {string} sPath - the path
			 * @returns {string}
			 * @public
		 	 * @instance
		 	 * @since 1.0.0
			 */
			getImageResourceUrl: function(sPath) {
				return this._getResourceUrl(sPath);
			},
			
			/**
			 * Returns a localized text from the i18n resource model following the convention:<br>
			 * <code[CharacteristicName].[TechnicalValue of Value] = My Sample Text</code>
			 * @param {*} oValue 
			 * @returns {string}
			 * @public
		 	 * @instance
		 	 * @since 1.0.0
			 */
			getLocalizedTextForValue: function(oValue) {
				var oCstic = this._getCsticData(oValue.CsticId);
				var oRb = this.getView().getModel("customView_i18n").getResourceBundle();
				return oRb.getText(oCstic.Name + "." + oValue.TechnicalValue)
			}
		}	
		
	
	});
});