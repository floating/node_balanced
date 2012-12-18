module.exports = exports = function(client, marketplace_id, api_secret) {

	var account = {

	      //creates a new balanced account
	      create: function(account, cb){

	        client("POST", "/v1/marketplaces/"+marketplace_id+"/accounts", account, cb)

	      },

	      //adds a card to their account
	      add_card: function(account_id, card_info_or_id, cb){

	        if(typeof card_info_or_id === "object"){ 
	          var card = {card:card_info_or_id}
	        }else{ 
	          var card = {card_uri:"/v1/marketplaces/"+marketplace_id+"/cards/"+card_info_or_id}
	        }
	        
	        client("PUT", "/v1/marketplaces/"+marketplace_id+"/accounts/"+account_id, card, cb) 

	      },

	      //debits the accounts card 
	      debit: function(account_id, debit, cb){

	        client("POST", "/v1/marketplaces/"+marketplace_id+"/accounts/"+account_id+"/debits", debit, cb)

	      },

	      //puts a hold on the accounts card
	      hold: function(account_id, hold, cb){

	        client("POST", "/v1/marketplaces/"+marketplace_id+"/accounts/"+account_id+"/holds", hold, cb)

	      },

	      //adds a bank account to this account
	      add_bank: function(account_id, bank_info_or_id, cb){

	        if(typeof bank_info_or_id === "object"){ 
	          var bank = {bank_account:bank_info_or_id}
	        }else{ 
	          var bank = {bank_account_uri:"/v1/marketplaces/"+marketplace_id+"/bank_accounts/"+bank_info_or_id}
	        }

	        client("PUT", "/v1/marketplaces/"+marketplace_id+"/accounts/"+account_id, bank, cb) 

	      },

	      //credits accounts bank account
	      credit: function(account_id, credit, cb){

	        client("POST", "/v1/marketplaces/"+marketplace_id+"/accounts/"+account_id+"/credits", credit, cb)

	      },

	      //adds extra deatils for underwriting purposes
	      underwrite: function(account_id, underwriting_info, cb){

	        client("PUT", "/v1/marketplaces/"+marketplace_id+"/accounts/"+account_id, {merchant: underwriting_info}, cb)

	      },

	      //returns account details
	      get: function(account_id, cb){

	        client("GET", "/v1/marketplaces/"+marketplace_id+"/accounts/"+account_id, cb)

	      },

	      //returns object of recent credits and debits for the account
	      transactions: function(account_id, cb){

	        client("GET", "/v1/marketplaces/"+marketplace_id+"/accounts/"+account_id+"/transactions", cb)

	      }
	};

	return account;

};