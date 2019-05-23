sap.ui.define([
	"./BaseController",
	"./constants",
	"sap/m/MessageToast",
	"sap/m/MessageBox",
	"sap/m/Button",
	"sap/ui/core/Icon",
	"sap/m/GroupHeaderListItem",
	"../model/formatter",
	"./TODOCalculator"
], function(Controller, constants, MessageToast, MessageBox, Button, Icon, GroupHeaderListItem, formatter, TODOCalculator) {
	"use strict";

	return Controller.extend("michadelic.dotodo.controller.Home", {

		formatter: formatter,

		TODOCalculator: new TODOCalculator(),

		onInit: function () {

		},

		onCreate: function () {
			this.getRouter().navTo("create");
		},

		onEdit: function (oEvent) {
			// prevent navigation when clicking on action buttons
			if (oEvent.getParameter("srcControl") instanceof Button || oEvent.getParameter("srcControl") instanceof Icon && oEvent.getParameter("srcControl").getId().endsWith("-img")) {
				return false;
			}
			var sId = oEvent.getParameter("listItem").getBindingContextPath().split("/").pop();
			this.getRouter().navTo("create", {
				id: sId
			});
		},

		onDelete: function (oEvent) {
			var oItem = oEvent.getParameter("listItem"),
				oContext = oItem.getBindingContext();

			MessageBox.confirm(this.getResourceBundle().getText("homeDeleteConfirm", [oContext.getProperty("title")]), {
				onClose: function (sResult) {
					if (sResult === MessageBox.Action.CANCEL) {
						return;
					}
					var iIndex = oContext.getPath().split("/").pop();
					var aTodos= this.getModel().getProperty("/todos");
					aTodos.splice(iIndex, 1);
					this.getModel().setProperty("/todos", aTodos);
					//this.getModel().updateBindings(true);
				}.bind(this)
			});
		},

		grouper: function (oContext) {
			var bValid = oContext.getObject();
			if (bValid) {
				var oObject = oContext.getObject();
				return this.TODOCalculator.getNextDate(oObject);
			}
		},

		/*getGroupHeader: function (oGroup) {
			var bVisible = !(oGroup.key === "");

			return new GroupHeaderListItem({
				title: oGroup.key,
				visible: bVisible
			}).addStyleClass("group");
		},*/

		done: function (oEvent) {
			var oContext = oEvent.getSource().getBindingContext();

			oContext.getObject().lastDone = Date.now();
			oContext.getObject().lastAmount++;
			oContext.setUpdated(true);
			this.getModel().updateBindings(true);
			MessageToast.show(this.getResourceBundle().getText("homeDoneConfirm", [oContext.getProperty("title")]));
		},

		snooze: function (oEvent) {
			var oContext = oEvent.getSource().getBindingContext();
			var oNow = new Date();
			var oDateToday = new Date(oNow.getFullYear(), oNow.getMonth(), oNow.getDate());
			var iMultiplier = 1;
			var oObject = oContext.getObject();

			switch (oObject.frequency) {
				case constants.FREQUENCY_WEEKLY: iMultiplier = 7; break;
				case constants.FREQUENCY_MONTHLY: iMultiplier = 30; break;
			}

			oContext.getObject().lastDone = oDateToday + constants.ONE_DAY * (iMultiplier + 1);
			oContext.setUpdated(true);
			this.getModel().updateBindings(true);
			MessageToast.show(this.getResourceBundle().getText("homeSnoozeConfirm", [oContext.getProperty("title")]));
		}

	});
});