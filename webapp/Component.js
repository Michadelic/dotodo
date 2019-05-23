sap.ui.define([
	"sap/ui/core/UIComponent",
	"./controller/constants",
	"sap/ui/Device",
	"./model/LocalStorageModel",
	"./model/models"
], function(UIComponent, constants, Device, LocalStorageModel, models) {
	"use strict";

	const SORT_URGENCY = "urgency";

	return UIComponent.extend("michadelic.dotodo.Component", {

		metadata: {
			manifest: "json"
		},

		/**
		 * The component is initialized by UI5 automatically during the startup of the app and calls the init method once.
		 * @public
		 * @override
		 */
		init: function() {
			//create and set cart model
			var oTodoModel = new LocalStorageModel("DOTODO", {
				"todos": [
				],
				settings: {
					"sort": SORT_URGENCY
				}
			});
			this.setModel(oTodoModel);

			this._oNewTodoDefault = {
				title: "TODO",
				description: "",
				icon: "sap-icon://task",
				category: "Misc",
				frequency: constants.FREQUENCY_DAILY,
				amount: 1
			};

			// call the base component's init function
			UIComponent.prototype.init.apply(this, arguments);

			// set the device model
			this.setModel(models.createDeviceModel(), "device");

			// create the views based on the url/hash
			this.getRouter().initialize();
		}
	});
});