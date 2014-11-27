import Ember from "ember";
import CreditExistingFundingInstrumentTransactionFactory from "balanced-dashboard/models/factories/credit-existing-funding-instrument-transaction-factory";
import CreditCustomerModalView from "./credit-customer-modal";

var CreditOrderModalView = CreditCustomerModalView.extend({
	templateName: "modals/credit-order-modal",
	elementId: "credit-order",
	title: "Credit this order",

	model: function() {
		return CreditExistingFundingInstrumentTransactionFactory.create({
			customer: this.get("recipient")
		});
	}.property("recipient"),

	merchantCustomer: Ember.computed.reads("order.seller"),
	ownerCustomer: Ember.computed.reads("marketplace.owner_customer"),

	recipientKey: "merchant",
	recipients: function() {
		return [{
				value: "merchant",
				label: "Merchant: %@".fmt(this.get("merchantCustomer.display_me"))
			}, {
				value: "marketplace",
				label: "Marketplace: %@".fmt(this.get("ownerCustomer.display_me"))
			}
		];
	}.property("ownerCustomer", "merchantCustomer"),

	recipient: function() {
		if (this.get("recipientKey") === "merchant") {
			return this.get("merchantCustomer");
		} else {
			return this.get("ownerCustomer");
		}
	}.property("recipientKey", "seller"),

	fundingInstruments: Ember.computed.reads("recipient.funding_instruments"),

	actions: {
		save: function() {
			var controller = this.get("controller");
			this.save(this.get("model"))
				.then(function(model) {
					controller.transitionToRoute(model.get("route_name"), model);
				});
		},
	}
});

CreditOrderModalView.reopenClass({
	open: function(order, marketplace) {
		return this.create({
			order: order,
			marketplace: marketplace
		});
	},
});

export default CreditOrderModalView;
