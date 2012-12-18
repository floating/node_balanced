module.exports = exports = function(client, marketplace_id, api_secret) {

	var marketplace = {

      //returns list of accounts for the marketplace  
      accounts: function(cb){

        client("GET", "/v1/marketplaces/"+marketplace_id+"/accounts", cb)

      },

      //returns list of debits for the marketplace
      debits: function(cb){

        client("GET", "/v1/marketplaces/"+marketplace_id+"/debits", cb)

      },

       //returns list of credits for the marketplace
      credits: function(cb){

        client("GET", "/v1/marketplaces/"+marketplace_id+"/credits", cb)

      },

       //returns list of refunds for the marketplace
      refunds: function(cb){

        client("GET", "/v1/marketplaces/"+marketplace_id+"/refunds", cb)

      },

       //returns list of holds for the marketplace
      holds: function(cb){

        client("GET", "/v1/marketplaces/"+marketplace_id+"/holds", cb)

      }
	};

	return marketplace;

};