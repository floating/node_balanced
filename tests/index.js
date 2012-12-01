var request = require("request")
var url = require("url")
var assert = require("assert")

var api_secret = null
var marketplace_id = null
var balanced = null
var test = {}

var client = function(method, uri, json, cb) {

  //make json param optional
  if(typeof json === 'function' && cb === undefined){cb = json; json = null}

  if(api_secret){
    uri = url.format({protocol: "https", host: "api.balancedpayments.com", auth: api_secret+':', pathname: uri})
  }else{
    uri = url.format({protocol: "https", host: "api.balancedpayments.com", pathname: uri})
  }

  request({
    method: method,
    uri: uri,
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


before(function(done){

  //create a marketplace
  client("POST", "/v1/api_keys", function(err, res){
    if(err){return done(err)}

    //set the api secret
    api_secret = res.secret

    client("POST", "/v1/marketplaces", function(err, res){
      if(err){return done(err)}

      marketplace_id = res.id

      test.email = function(){ return Math.random()+'test@testing.com' }
      test.card_info = {card_number: "5105105105105100", expiration_month: "12", expiration_year: "2020", security_code: "123"}
      test.bank_info = {name: "Johann Bernoulli", account_number: "9900000001", routing_number: "121000358", type: "checking"}

      var count = 0
      var track = function(){
        if(++count === 2){
          balanced = require("../index")(api_secret, marketplace_id)
          done()
        }
      }
      //create a card token
      client("POST", "/v1/marketplaces/"+marketplace_id+"/cards", {
        card_number: "5105105105105100",
        expiration_month: "12",
        expiration_year: "2015",
        security_code: "123"
      }, function(err, res){
        if(err){ 
          done(err) 
        }else{ 
          test.card_id = res.id 
          track()
        }
      })
      //create bank token
      client("POST", "/v1/bank_accounts", test.bank_info, function(err, res){
        if(err){ 
          done(err) 
        }else{ 
          test.bank_id = res.id 
          track()
        }
      })
    })
  })
})





//TESTS
describe('balanced', function(){


  //ACCOUNT
  describe('.account', function(){

    describe('.create', function(){

      it('should create a valid balanced account', function(done){

        balanced.account.create({email_address: test.email()}, function(err, res){

          assert.equal(err, null, err)
          assert.notEqual(res.id, null, "account.id is null")

          if(res.id){test.account_id = res.id}
          
          done()

        })

      })

    })

    describe('.add_card (w/id)', function(){

      it('should add a card to the account with a id as input', function(done){

        balanced.account.add_card(test.account_id, test.card_id, function(err, res){

          assert.equal(err, null, err)
          assert.notEqual(res.id, null, "account_id is null")

          done()

        })
      })
    })

    describe('.add_card (w/info)', function(){

      it('should add a card to the account with a token as input', function(done){

        balanced.account.add_card(test.account_id, test.card_info, function(err, res){

          assert.equal(err, null, err)
          assert.notEqual(res.id, null, "account_id is null")

          done()

        })
      })
    })

    describe('.debit', function(){

      it('should debit the users account $10', function(done){

        balanced.account.debit(test.account_id, {
          amount: 1000,
          appears_on_statement_as: 'TEST TEXT',
          description: 'node_balanced test debit, $10'
        }, function(err, res){

          assert.equal(err, null, err)
          assert.notEqual(res.id, null, "debit_id is null")

          done()

        })
      })
    })


    describe('.hold', function(){

      it('should put a hold on users account for $5', function(done){

        balanced.account.hold(test.account_id, {
          amount: 500
        }, function(err, res){

          assert.equal(err, null, err)
          assert.notEqual(res.id, null, "hold_id is null")

          done()

        })
      })
    })



    describe('.add_bank (w/id)', function(){

      it('should add a bank account to the account with a id as input', function(done){

        balanced.account.add_bank(test.account_id, test.bank_id, function(err, res){

          assert.equal(err, null, err)
          assert.notEqual(res.id, null, "account_id is null")

          done()

        })
      })
    })

    describe('.add_bank (w/info)', function(done){

      it('should add a bank account to the account with a info as input', function(done){

        balanced.account.add_bank(test.account_id, test.bank_info, function(err, res){

          assert.equal(err, null, err)
          assert.notEqual(res.id, null, "account_id is null")

          done()

        })
      })

    })

    describe('.credit', function(done){

      it('should credit this account\'s bank_account with $5', function(done){

        balanced.account.credit(test.account_id, {
          amount: 500,
          description: 'node_balanced test'
        }, function(err, res){

          assert.equal(err, null, err)
          assert.notEqual(res.id, null, "account_id is null")

          done()

        })
      })

    })

    describe('.underwrite', function(done){

      it('should underwrite this account', function(done){

        balanced.account.underwrite(test.account_id, {
          type: 'person',
          phone_number: '+19046281796',
          postal_code: '94110',
          street_address: 'Somewhere over the rainbow',
          dob: '1980-01-01' ,
          name: "Johann Bernoulli",
        },function(err, res){

          assert.equal(err, null, err)
          assert.notEqual(res.id, null, "res.id is null")

          done()

        })
      })

    })

    describe('.get', function(done){

      it('should get the deatils for this account', function(done){

        balanced.account.get(test.account_id, function(err, res){

          assert.equal(err, null, err)
          assert.notEqual(res.id, null, "account_id is null")

          done()

        })
      })

    })

    describe('.activity', function(done){

      it('should get all the debits/credits this account', function(done){

        balanced.account.transactions(test.account_id, function(err, res){

          assert.equal(err, null, err)
          assert.notEqual(res.items, null, "res.items is null")

          done()

        })
      })
    })

  })


  //MARKETPLACE
  describe('.marketplace', function(){

    describe('.accounts', function(done){

      it('should get all the debits/credits this account', function(done){

        balanced.marketplace.accounts(function(err, res){

          assert.equal(err, null, err)
          assert.notEqual(res.items, null, "res.items is null")

          done()

        })
      })

    })

    describe('.debits', function(done){

      it('should get all the debits/credits this account', function(done){

        balanced.marketplace.debits(function(err, res){

          assert.equal(err, null, err)
          assert.notEqual(res.items, null, "res.items is null")

          done()

        })
      })

    })

    describe('.credits', function(done){

      it('should get all the debits/credits this account', function(done){

        balanced.marketplace.credits(function(err, res){

          assert.equal(err, null, err)
          assert.notEqual(res.items, null, "res.items is null")

          done()

        })
      })
    })

    describe('.refunds', function(done){

      it('should get all the debits/credits this account', function(done){

        balanced.marketplace.refunds(function(err, res){

          assert.equal(err, null, err)
          assert.notEqual(res.items, null, "res.items is null")

          done()

        })
      })
    })

    describe('.holds', function(done){

      it('should get all the debits/credits this account', function(done){

        balanced.marketplace.holds(function(err, res){

          assert.equal(err, null, err)

          done()

        })
      })
    })


  })
})
