/*
 * ${copyright}
 */

sap.ui.define([
	"sap/ui/base/ManagedObject",
	"sap/base/strings/formatMessage"
], function(ManagedObject, formatMessage) {
	"use strict";

	/**
     * Implementation of the Characteristic Group Client API. Each VC UI Extension view controller (which needs to be derived from
	 * {@link module:sap/i2d/lo/lib/vchclf/api/valuation/controller/CustomCharacteristicGroupBase}
     * ) owns an instance of this object and has access. It allows to retrieve Characteristic data independent of the context to
	 * which a {@link module:sap/i2d/lo/lib/vchclf/api/valuation/control/CustomCharacteristic}
	 * is bound. Furthermore loading of Domain Values can be manally triggered (e.g. for an custom Value Help implementation) and
	 * value assignments can be made. This is especially helpfull when it comes to own event handler implementations if the
	 * provided ones are not sufficient.
     *
     * @public
     * @author I517211
     * @since 1.0.0
     * @extends sap.ui.core.ManagedObject
     * 
	 * @module sap/i2d/lo/lib/vchclf/api/valuation/CharacteristicGroupClientObject
     */
	return ManagedObject.extend("sap.i2d.lo.lib.vchclf.api.valuation.CharacteristicGroupClientObject", { /** @lends sap.i2d.lo.lib.vchclf.api.valuation.data.CharacteristicGroupClientObject.prototype */

		constructor: function(oComponent, oModel, sNamespace) {
			this._oComponent = oComponent;
			this._oModel = oModel;
			this._sNamespace = sNamespace; 
		},
		
		/**
		 * Applies the given technical values to the Characteristic bound to the specified CharacteristicContextContainer control
		 * @param {module:sap/i2d/lo/lib/vchclf/api/valuation/control/CharacteristicContextContainer} oCsticContextContainerControl - the CharacteristicContextContainer control for which values should be applied
		 * @param {string[]} aTechnicalValues - the technical values as strings
		 * @returns {Promise} - a Promise which is resolved when the values have been applied
		 * @instance
		 * @public
		 * @since 1.0.0
		 */
		applyValues: function(oCsticContextContainerControl, aTechnicalValues) {
			var oCstic = oCsticContextContainerControl.getBindingContext("view").getObject();
			this._oComponent.applyTechnicalValues(this._oModel, oCstic, aTechnicalValues);
		},
		
		/**
		 * Applies the default values of the Characteristic bound to the specified CharacteristicContextContainer control
		 * @param {module:sap/i2d/lo/lib/vchclf/api/valuation/control/CharacteristicContextContainer} oCsticContextContainerControl - the CharacteristicContextContainer control for which default values should be applied
		 * @returns {Promise} - a Promise which is resolved when the values have been applied
		 * @instance
		 * @public
		 * @since 1.0.0
		 */
		applyDefaultValues: function(oCsticContextContainerControl) {
			var oCstic = oCsticContextContainerControl.getBindingContext("view").getObject();
			
			var aDefaults = [];
				
			oCstic.DomainValues.forEach(function(oDomainValue) {
				if (oDomainValue.IsDefaultValue) {
					aDefaults.push(oDomainValue.TechnicalValue);
				}
			});
			this._oComponent.applyTechnicalValues(this._oModel, oCstic, aDefaults);	
		},
		
		/**
		 * Loads the Domain Values for the Characteristic bound to the given CharacteristicContextContainer control
		 * @param {module:sap/i2d/lo/lib/vchclf/api/valuation/control/CharacteristicContextContainer} oControl 
		 * @returns {Promise} - a Promise which is resolved when loading is finished
		 * @instance
		 * @public
		 * @since 1.0.0
		 */
		loadDomainValues: function(oControl) {
			return Promise.resolve();
		},
		
		/**
		 * Selects the given Characteristic - the inspector will then show the details of the selected Characteristic
		 * @param {string} sCsticName - the Characteristic name
		 * @instance
		 * @public
		 * @since 1.0.0
		 */
		selectCharacteristic: function(sCsticName) {
			console.error(formatMessage("The 'onShowInInspectorByCharcContext' function can not be tested in local mock mode.", []));
		},
		
		/**
		 * Returns a deployment specific URL for the given relative path starting from the project root folder
		 * @param {string} sPath - the path
		 * @returns {string}
		 * @public
		 * @instance
		 * @since 1.0.0
		 */
		getResourceUrl: function(sPath) {
			if (sPath.charAt(0) !== "/") {
				sPath = "/" + sPath;  
			}
			return sap.ui.require.toUrl(this._sNamespace + sPath);
		},
		
		/**
		 * Returns the Characteristic name for the given Characteristic id
		 * @param {string} sCsticId - the Characteristic id
		 * @returns {string}
		 * @instance
		 * @public
		 * @since 1.0.0
		 */
		getCharacteristicName: function(sCsticId) {
			var mCstics = this._oModel.getProperty("/Characteristics");
			for (var sName in mCstics) {
				if (mCstics[sName].CsticId === sCsticId) {
					return sName;
				}
			}
			return null;
		},
		
		/**
		 * Returns the Characteristic data object for the given Characteristic name
		 * @param {string} sCsticName - the Characteristic name 
		 * @returns {object}
		 * @instance
		 * @public
		 * @since 1.0.0
		 */
		getCharacteristicData: function(sCsticName) {
			var mCstics = this._oModel.getProperty("/Characteristics");
			return mCstics[sCsticName];
		},
		
		/**
		 * Returns if the given Characteristic is part of the Characteristic Group to which this instance of the Characteristic Group Client object is bound
		 * <code>true</code> if the Characteristic is contained, <code>false</code> otherwise
		 * @param {string} sCsticName - the Characteristic name 
		 * @returns {boolean}
		 * @instance
		 * @public
		 * @since 1.0.0
		 */
		hasCharacteristic: function(sCsticName) {
			var mCstics = this._oModel.getProperty("/Characteristics");
			return mCstics[sCsticName] !== undefined;
		}
		


		
	});
	
});