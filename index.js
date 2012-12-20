var request = require("request")
var url = require("url")

module.exports = function(api_secret, marketplace_id) {

  if (api_secret === undefined){throw new Error("missing required api_secret")}
  if (marketplace_id === undefined){throw new Error("missing required marketplace_id")}

  var client = function(method, uri, json, cb) {

    //make json param optional
    if(typeof json === 'function' && cb === undefined){cb = json; json = null}

    request({
      method: method,
      uri: url.format({protocol: "https", host: "api.balancedpayments.com", auth: api_secret+":", pathname: uri}),
      encoding: "utf-8",
      json: json || true
    }, function(err, response, body) {
      if (response.statusCode >= 400){

        if(body !== undefined){
          err = new Error("Balanced call failed: "+response.statusCode+" - "+body.response)
        }else{
          err = new Error("Balanced call failed: "+response.statusCode)
        }
      }

      cb(err, body)
      
    })
  }

  //needle should equal things like "account", "marketplace", "bank_account", etc.
  var getId = function(haystack, needle) {

    //It would appear that we were passed an actual ID, not a URI
    if(haystack.indexOf("/") < 0){
      return haystack
    }

    //All of Balanced's APIs end their resources with an s.  Like "bank_accounts" instead of "bank_account"
    if(needle.substr(needle.length - 1) !== "s") {
      needle = needle + "s"
    }

    var patt = new RegExp("/"+needle+"/([^/]+)")
    var match = patt.exec(haystack)

    if(match !== null && match.length === 2){
      return match[1]
    } else {
      return false
    }
  }

  return {
    
     account: {

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
    },

    marketplace: {

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

    }
  }
}