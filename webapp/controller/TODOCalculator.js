sap.ui.define([
	"sap/ui/base/Object",
	"./constants",
], function (Object,constants) {
	"use strict";

	return Object.extend("michadelic.dotodo.controller.TODOCalculator", {

		init: function () {

		},

		getNextDate(oObject) {
			var oNow = new Date();
			var oDateToday = new Date(oNow.getFullYear(), oNow.getMonth(), oNow.getDate());

			var iMultiplier = 1;
			switch (oObject.frequency) {
				case constants.FREQUENCY_DAILY: iMultiplier = 1; break;
				case constants.FREQUENCY_WEEKLY: iMultiplier = 7; break;
				case constants.FREQUENCY_MONTHLY: iMultiplier = 30; break;
			}

			var iLastTime = oObject.lastDone || 0;
			var iDelta = oObject.lastDone - oDateToday.getTime() + constants.ONE_DAY * (iMultiplier);

			// überfällig, fällig, next, später
			if (iDelta < 0) {
				return "überfällig";
			} else if (iDelta < constants.ONE_DAY) {
				return "heute";
			} if (iDelta < constants.ONE_DAY * 2) {
				return "morgen";
			} if (iDelta < constants.ONE_DAY * 7) {
				return "diese Woche";
			} else {
				return "next";
			}
		}

	});
});