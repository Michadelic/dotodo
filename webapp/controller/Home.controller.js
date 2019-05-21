sap.ui.define([
	"./BaseController",
	"sap/m/MessageToast",
	"sap/m/MessageBox",
	"sap/m/Button",
	"sap/ui/core/Icon",
	"sap/m/GroupHeaderListItem",
	"../model/formatter"
], function(Controller, MessageToast, MessageBox, Button, Icon, GroupHeaderListItem, formatter) {
	"use strict";

	const ONE_DAY = 86400 * 1000;

	return Controller.extend("sap.ui.demo.basicTemplate.controller.Home", {

		formatter: formatter,

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
				var iDelta = Date.now() - oContext.getObject().lastDone;
				// überfällig, fällig, next, später
				if (iDelta < ONE_DAY && iDelta > 0) {
					return "fällig";
				} else if (iDelta > ONE_DAY) {
					return "überfällig";
				} else {
					return "next";
				}
			}
		},

		getGroupHeader: function (oGroup) {
			var bVisible = !(oGroup.key === "");

			return new GroupHeaderListItem({
				title: oGroup.key,
				visible: bVisible
			}).addStyleClass("group");
		},

		done: function (oEvent) {
			var oContext = oEvent.getSource().getBindingContext();

			oContext.getObject().lastDone = Date.now();
			oContext.setUpdated(true);
			this.getModel().updateBindings(true);
			MessageToast.show(this.getResourceBundle().getText("homeDoneConfirm", [oContext.getProperty("title")]));
		}

	});
});