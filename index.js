var request = require("request");
var url = require("url");

module.exports = function(api_secret, marketplace_id) {

  if (api_secret === undefined){throw new Error("missing required api_secret");}
  if (marketplace_id === undefined){throw new Error("missing required marketplace_id");}

  var client = function(method, uri, json, cb) {

    //make json param optional
    if (typeof json === 'function' && cb === undefined){cb = json; json = null;}

    request({
      method: method,
      uri: url.format({protocol: "https", host: "api.balancedpayments.com", auth: api_secret + ":", pathname: uri}),
      encoding: "utf-8",
      json: json || true
    }, function(err, response, body) {
      if (response.statusCode >= 400){

        if (body !== undefined){
          err = new Error("Balanced call failed: " + response.statusCode + " - " + body.response);
        } else {
          err = new Error("Balanced call failed: " + response.statusCode);
        }
      }

      cb(err, body);

    });
  }

  return {

     account: {

      //creates a new balanced account
      create: function(account, cb){

        client("POST", "/v1/marketplaces/" + marketplace_id + "/accounts", account, cb);

      },

      //adds a card to their account
      add_card: function(account_id, card_info_or_id, cb){

        if (typeof card_info_or_id === "object"){
          var card = {card:card_info_or_id};
        } else {
          var card = {card_uri:"/v1/marketplaces/" + marketplace_id + "/cards/" + card_info_or_id};
        }

        client("PUT", "/v1/marketplaces/" + marketplace_id + "/accounts/" + account_id, card, cb);

      },

      //debits the accounts card
      debit: function(account_id, debit, cb){

        client("POST", "/v1/marketplaces/" + marketplace_id + "/accounts/" + account_id + "/debits", debit, cb);

      },

      //puts a hold on the accounts card
      hold: function(account_id, hold, cb){

        client("POST", "/v1/marketplaces/" + marketplace_id + "/accounts/" + account_id + "/holds", hold, cb);

      },

      //adds a bank account to this account
      add_bank: function(account_id, bank_info_or_id, cb){

        if (typeof bank_info_or_id === "object"){
          var bank = {bank_account:bank_info_or_id}
        } else {
          var bank = {bank_account_uri:"/v1/marketplaces/" + marketplace_id + "/bank_accounts/" + bank_info_or_id}
        }

        client("PUT", "/v1/marketplaces/" + marketplace_id + "/accounts/" + account_id, bank, cb);

      },

      //credits accounts bank account
      credit: function(account_id, credit, cb){

        client("POST", "/v1/marketplaces/" + marketplace_id + "/accounts/" + account_id + "/credits", credit, cb);

      },

      //adds extra deatils for underwriting purposes
      underwrite: function(account_id, underwriting_info, cb){

        client("PUT", "/v1/marketplaces/" + marketplace_id + "/accounts/" + account_id, {merchant: underwriting_info}, cb);

      },

      //returns account details
      get: function(account_id, cb){

        client("GET", "/v1/marketplaces/" + marketplace_id + "/accounts/" + account_id, cb);

      },

      //returns object of recent credits and debits for the account
      transactions: function(account_id, cb){

        client("GET", "/v1/marketplaces/" + marketplace_id + "/accounts/" + account_id + "/transactions", cb);

      }
    },

    marketplace: {

      //returns list of accounts for the marketplace
      accounts: function(cb){

        client("GET", "/v1/marketplaces/" + marketplace_id + "/accounts", cb);

      },

      //returns list of debits for the marketplace
      debits: function(cb){

        client("GET", "/v1/marketplaces/" + marketplace_id + "/debits", cb);

      },

       //returns list of credits for the marketplace
      credits: function(cb){

        client("GET", "/v1/marketplaces/" + marketplace_id + "/credits", cb);

      },

       //returns list of refunds for the marketplace
      refunds: function(cb){

        client("GET", "/v1/marketplaces/" + marketplace_id + "/refunds", cb);

      },

       //returns list of holds for the marketplace
      holds: function(cb){

        client("GET", "/v1/marketplaces/" + marketplace_id + "/holds", cb);

      }

    }, // /marketplace

    card: {

	/*
		card_info, where a parameter, should be an object with these attributes:

		From Balanced's API documentation: * is required when POSTing.  Update/PUT requires just those attributes you're updating.

		* card_number		string. The digits of the credit card number.
		* expiration_year	integer. Expiration year. The current year or later. Value must be <= 9999.
		* expiration_month	integer. Expiration month (e.g. 1 for January). If expiration_year is the current year then current month or later, otherwise 1. Value must be <= 12.
		* postal_code		string. Postal code. This is known as a zip code in the USA. requires country_code.
		* street_address	string. Street address. requires postal_code.
		security_code		string. The 3-4 digit security code for the card.
		name				string. Sequence of characters. Length must be <= 128.
		phone_number		string. E.164 formatted phone number. Length must be <= 15.
		city				string. City.
		country_code		string. ISO-3166-3 three character country code.
		meta				object. Single level mapping from string keys to string values.
		is_valid			boolean. Indicates whether the card is active (true) or has been deactivated (false).

	*/

      create: function(card_info, cb){ //tokenizes a card

        client("POST", "/v1/marketplaces/" + marketplace_id + "/cards", card_info, cb);

      },

	  retrieve: function(card_id, cb) { //retrieves info about one card

		client("GET", "/v1/marketplaces/" + marketplace_id + "/cards/" + card_id, cb);

	  },

	  list_all: function(cb) { //returns a list of all cards you've created

		client("GET", "/v1/marketplaces/" + marketplace_id + "/cards", cb);

	  },

	  update: function(card_id, card_info, cb) { // update some attributes of the card

		client("PUT", "/v1/marketplaces/" + marketplace_id + "/cards/" + card_id, card_info, cb);

	  },

	  invalidate: function(card_id, cb) { // mark a card as invalid

		client("PUT", "/v1/marketplaces/" + marketplace_id + "/cards/" + card_id, {is_valid: false}, cb);

	  }

    }, // /card

    debit: {
		/*

			Debits an account. Returns a uri that can later be used to reference;
			this debit. Successful creation of a debit using a card will return an;
			associated hold mapping as part of the response. This hold was created;
			and captured behind the scenes automatically. For ACH debits there is no;
			corresponding hold.

			* is required for create/POST;

			amount						integer. If the resolving URI references a hold then this is hold amount. You can always capture less than the hold amount (e.g. a partial capture). Otherwise its the maximum per debit amount for your marketplace. Value must be >= the minimum per debit amount for your marketplace. Value must be <= the maximum per debit amount for your marketplace.
			appears_on_statement_as		string. Text that will appear on the buyer's statement. Characters are limited to ASCII, digits, and (.<>(){}[] + &!$*;-%_?:#@~='" ^\`|), length <= 22.
			meta						object. Single level mapping from string keys to string values.
			description					string. Sequence of characters.
			account_uri					string.
			on_behalf_of_uri			string. The account of a merchant, usually a seller or service provider, that is associated with this card charge or bank account debit.
			merchant_uri				string. Deprecated The account of a merchant, usually a seller or service provider, that is associated with this card charge or bank account debit. Deprecated in favour of on_behalf_of_uri.
			hold_uri					string. If no hold is provided one my be generated and captured if the funding source is a card.
			source_uri					string. URI of a specific bank account or card to be debited.
			bank_account_uri			string. Deprecated This field is deprecated in favour of source_uri.
			card_uri					string. Deprecated This field is deprecated in favour of source_uri.

		*/

    	create: function (params, cb) {
		  /*
			params: {account_id: string, debit_info: {object}}
		  */

    	  console.log({debit_info: params.debit_info});

    	  client("POST", "/v1/marketplaces/" + marketplace_id + "/accounts/" + params.account_id + "/debits", params.debit_info, cb);

    	},

    	retrieve: function (debit_id, cb) {

    	  client("GET", "/v1/marketplaces/" + marketplace_id + "/debits/" + debit_id, cb);

    	},

    	list_all: function (cb) {

    	  client("GET", "/v1/marketplaces/" + marketplace_id + "/debits", cb);

    	},

    	list_all_in_account: function (account_id, cb) {

			client("GET", "/v1/marketplaces/" + marketplace_id + "/accounts/" + account_id + "/debits", cb);

    	},

    	update: function (params, cb) {
    		/*
    			params: {account_id: string, debit_id: string, debit_info: {object}}
    		*/

			client("PUT", "/v1/marketplaces/" + marketplace_id + "/accounts/" + params.account_id + "/debits/" + params.debit_id, params.debit_info, cb);

    	},

    	refund: function (debit_id, cb) {

			client("POST", "/v1/marketplaces/" + marketplace_id + "/debits/" + params.debit_id + "/refunds", {}, cb);

    	}

    }, // /debit

    hold: {

    	create: function (cb) {},

    	retrieve: function (hold_id, cb) {},


    	list_all: function (cb) {


    	},

    	list_all_in_account: function (account_id, cb) {

    	},
    	update: function (hold_id, cb) {



    	},

    	capture: function (cb) {



    	},

    	voidHold: function (cb) {




    	}

    }, // /hold

    refund: {

    	create: function (cb) {},

    	retrieve: function (refund_id, cb) {},

    	list_all: function (cb) {


    	},

    	list_all_in_account: function (account_id, cb) {

    	},

    	update: function (refund_id, cb) {}

    } // /refund


  }
}