module.exports = exports = function(client, marketplace_id, api_secret) {

	var card = {

		tokenize: function(card_info, cb){

			client("POST", "/v1/marketplaces/"+marketplace_id+"/cards", card_info, cb)

		},

		getId: function(uri){
	        if(typeof(uri) !== "string"){
	          return false
	        }

	        var matches = uri.match(/\/v1\/marketplaces\/[^\/]+\/cards\/([^\/\?]+)/)

	        if(matches === null) {
	        	matches = uri.match(/\/v1\/marketplaces\/[^\/]+\/accounts\/[^\/]+\/cards\/([^\/\?]+)/)
	        }

	        if(matches.length === 2){
	          return matches[1]
	        } else {
	          return false
	        }
    	},

    	get: function(card_id, cb){

    		client("GET", "/v1/marketplaces/"+marketplace_id+"/cards/"+card_id, cb)

    	},

    	update: function(card_id, metadata, isValid, cb){

    		var updates = {
    			meta: metadata
    		}

    		if(typeof(isValid) === "function" && typeof(cb) === "undefined") {
    			cb = isValid
    		} else {
    			updates.is_valid = isValid
    		}

    		client("PUT", "/v1/marketplaces/"+marketplace_id+"/cards/"+card_id, updates, cb)
    	},

    	associate: function(card_id, account_id, cb){

    		var body = {account_uri: "/v1/marketplaces/"+marketplace_id+"/accounts/"+account_id}

    		client("PUT", "/v1/marketplaces/"+marketplace_id+"/cards/"+card_id, body, cb)

    	}

	};

	return card;

};