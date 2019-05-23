sap.ui.define([
	"../controller/TODOCalculator"
], function (TODOCalculator) {
	"use strict";

	var oTODOCalculator = new TODOCalculator();

	return {
		debugInfos: function (oContext) {
			var sResults;
			sResults = oContext.amount + "x " + oContext.frequency + ", lastDone: " + new Date(oContext.lastDone )+ ", lastAmount: " + oContext.lastAmount + ", next: " + oTODOCalculator.getNextDate(oContext);
			return sResults;
		}
	};
});