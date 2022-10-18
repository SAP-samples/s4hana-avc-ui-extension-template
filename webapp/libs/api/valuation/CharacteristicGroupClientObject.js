/*
 * ${copyright}
 */

sap.ui.define([
	"sap/ui/base/ManagedObject",
	"sap/base/strings/formatMessage"
], function(ManagedObject, formatMessage) {
	"use strict";

	return ManagedObject.extend("sap.i2d.lo.lib.vchclf.api.valuation.CharacteristicGroupClientObject", { /** @lends sap.i2d.lo.lib.vchclf.api.valuation.data.CharacteristicGroupClientObject.prototype */

		constructor: function(oComponent, oModel, sNamespace) {
			this._oComponent = oComponent;
			this._oModel = oModel;
			this._sNamespace = sNamespace; 
		},
		
		applyValues: function(oCsticContextContainerControl, aTechnicalValues) {
			var oCstic = oCsticContextContainerControl.getBindingContext("view").getObject();
			this._oComponent.applyTechnicalValues(this._oModel, oCstic, aTechnicalValues);
		},
		
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
		
		loadDomainValues: function(oControl) {
			return Promise.resolve();
		},
		
		selectCharacteristic: function(sCsticName) {
			console.error(formatMessage("The 'onShowInInspectorByCharcContext' function can not be tested in local mock mode.", []));
		},
		
		getResourceUrl: function(sPath) {
			if (sPath.charAt(0) !== "/") {
				sPath = "/" + sPath;  
			}
			return sap.ui.require.toUrl(this._sNamespace + sPath);
		},
		
		getCharacteristicName: function(sCsticId) {
			var mCstics = this._oModel.getProperty("/Characteristics");
			for (var sName in mCstics) {
				if (mCstics[sName].CsticId === sCsticId) {
					return sName;
				}
			}
			return null;
		},
		
		getCharacteristicData: function(sCsticName) {
			var mCstics = this._oModel.getProperty("/Characteristics");
			return mCstics[sCsticName];
		},
		
		hasCharacteristic: function(sCsticName) {
			var mCstics = this._oModel.getProperty("/Characteristics");
			return mCstics[sCsticName] !== undefined;
		}
		


		
	});
	
});