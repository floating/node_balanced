#node_balanced

The [Balanced](https://balancedpaymnets.com/) [API](https://balancedpayments.com/docs/api) for Node.

## Installation

`npm install balanced`

## Usage Overview
```javascript

  var balanced = require('balanced')(api_secret, marketplace_id)

  balanced.account.create({email_address: 'test@test.com'}, function(err, res){
    if (err) {
      console.log("Error creating account.")
      return console.log(err)
    }
    console.log("account_id: "+res.id)
  })

```

## API

All methods take a callback as their last parameter. 

The callback is called with an error (if any) and then the response body (if any). `cb(err, res)`

* `balanced`
  * `.account`
      * `.create(email, cb)` - creates a new balanced account, takes bank/card info/tokens in options
      * `.add_card(account_id, card_info_or_id, cb)` - adds a card to their account
      * `.debit(account_id, debit, cb)` - debits the accounts card
      * `.hold(account_id, hold, cb) ` - puts a hold on the accounts card
      * `.add_bank(account_id, bank_info_or_id, cb)` - adds a bank account to this account
      * `.credit(account_id, credit, cb)` - credits accounts bank account
      * `.underwrite(account_id, underwriting_info, cb)` - adds extra deatils for underwriting purposes
      * `.get(account_id, cb)` - returns account details
      * `.transactions(account_id, cb)` - returns object of recent credits and debits for the account
  * `.marketplace`
      * `.accounts(cb)` - get all of the marketplace's accounts
      * `.debits(cb)` - get all of the marketplace's debits
      * `.credits(cb)` - get all of the marketplace's credits
      * `.refunds(cb)` - get all of the marketplace's refunds
      * `.holds(cb)` - get all of the marketplace's holds

## Tests

To run the tests, install mocha with `npm install mocha -g`, then run

`BALANCED_API_SECRET=your_test_api_secret BALANCED_MARKETPLACE_ID=your_test_marketplace_id npm test`

## Author

C. Jordan Muir (cjm712@gmail.com). Development sponsored by [HashPay](https://hashpay.com/).

## License

Copyright (C) 2012 C. Jordan Muir

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.