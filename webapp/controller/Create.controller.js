sap.ui.define([
	"./BaseController",
	"sap/m/MessageToast",
	"../model/formatter"
], function(Controller, MessageToast, formatter) {
	"use strict";

	return Controller.extend("michadelic.dotodo.controller.Create", {

		formatter: formatter,

		onInit: function () {
			this.getRouter().getRoute("create").attachMatched(this._onRouteMatched.bind(this));
		},

		_onRouteMatched: function (oEvent) {
			var sId = oEvent.getParameter("arguments").id;

			if (sId) {
				// edit: copy existing object into new context and add id
				var oEditTodo = Object.assign({}, this.getModel().getProperty("/todos/" + sId));
				oEditTodo.id = sId;
				this.getModel().setProperty("/new", oEditTodo);
				this.getView().bindElement({
					path: "/new"
				});
			} else {
				// new: pick up temporary entry or copy defaults into new context
				var oNewTodo = this.getModel().getProperty("/new");
				if (!oNewTodo || oNewTodo.id) {
					oNewTodo = Object.assign({}, this.getOwnerComponent()._oNewTodoDefault);
				}
				this.getModel().setProperty("/new", oNewTodo);
				this.getView().bindElement({
					path: "/new"
				});
			}
		},

		onSave: function () {
			var oNewTodo = this.getModel().getProperty("/new");
			var aTodos = this.getModel().getProperty("/todos");

			if (oNewTodo.id) {
				// edit: update existing entry by id
				aTodos[oNewTodo.id] = oNewTodo;
				delete oNewTodo.id;
				MessageToast.show(this.getResourceBundle().getText("createEditConfirm", [oNewTodo.title]))
			} else {
				// new: add new todo at the end
				aTodos.push(oNewTodo);
				MessageToast.show(this.getResourceBundle().getText("createNewConfirm", [oNewTodo.title]))
			}
			this.getModel().setProperty("/todos", aTodos);
			this.getModel().setProperty("/new", undefined);

			this.getRouter().navTo("home");
		}
	});
});