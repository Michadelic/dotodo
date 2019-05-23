sap.ui.define([
	"./BaseController",
	"michadelic/dotodo/model/formatter"
], function(Controller, formatter) {
	"use strict";

	return Controller.extend("michadelic.dotodo.controller.App", {

		formatter: formatter,

		onInit: function () {

		}
	});
});