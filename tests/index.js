if (!process.env.BALANCED_API_SECRET || !process.env.BALANCED_MARKETPLACE_ID) {
  console.log("You must have environment variables BALANCED_API_SECRET and BALANCED_MARKETPLACE_ID set with test data.\n")
  console.log("ex: BALANCED_API_SECRET=[your_test_api_secret] BALANCED_MARKETPLACE_ID=[your_test_marketplace_id] npm test\n")
  process.exit(2) 
}

var balanced = require("../index")(process.env.BALANCED_API_SECRET, process.env.BALANCED_MARKETPLACE_ID);
var assert = require("assert");


var test = {
  email: function(){ return Math.random()+'test@testing.com' },
  card_info: {
    card_number: "5105105105105100",
    expiration_month: "12",
    expiration_year: "2020",
    security_code: "123"
  },
  bank_info: {
    name: "Johann Bernoulli",
    account_number: "9900000001",
    routing_number: "121000358",
    type: "checking"
  }
}



before(function(done){

  var count = 0
  var track = function(){if(++count === 2){done()}}

  var marketplace_id = process.env.BALANCED_MARKETPLACE_ID

  //create a token
  balanced.client("POST", "/v1/marketplaces/"+marketplace_id+"/cards", {
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
  balanced.client("POST", "/v1/bank_accounts", test.bank_info, function(err, res){
    if(err){ 
      done(err) 
    }else{ 
      test.bank_id = res.id 
      track()
    }
  })

})


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
