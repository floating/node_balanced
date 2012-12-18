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

  return {
    account: require(__dirname + "/lib/account.js")(client, marketplace_id, api_secret),
    marketplace: require(__dirname + "/lib/marketplace.js")(client, marketplace_id, api_secret),
    card: require(__dirname + "/lib/card.js")(client, marketplace_id, api_secret)
  }
};