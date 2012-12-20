#node_balanced

The [Balanced API](https://balancedpayments.com/docs/api) for Node.

## Installation

`npm install balanced`

## Usage Overview
```javascript

  var balanced = require('balanced')(api_secret, marketplace_id)

  //any inital account info - see documentation for all possible params
  var account = {email_address: 'test@test.com'}

  balanced.account.create(account, function(err, res){

    //make sure there were no errors
    if (err) { return console.log(err) }

    //account created
    console.log("account_id: "+res.id)

  })

```

## API

All methods take a callback as their last parameter, it's called with an error, if any, and the response body, if any.

`cb = function(err, res){ //the response from balanced }`

* `balanced`
  * `.account`
      * `.create(account, cb)` - creates a new balanced account, takes bank/card info/ids in options
      * `.add_card(account_id, card_info_or_id, cb)` - adds a card to their account
      * `.debit(account_id, debit, cb)` - debits the account's card
      * `.hold(account_id, hold, cb) ` - puts a hold on the account's card
      * `.add_bank(account_id, bank_info_or_id, cb)` - adds a bank account to this account
      * `.credit(account_id, credit, cb)` - credits account's bank account
      * `.underwrite(account_id, underwriting_info, cb)` - adds extra deatils for underwriting purposes
      * `.get(account_id, cb)` - returns account details
      * `.transactions(account_id, cb)` - returns object of credits and debits for the account
      * `.assets(account_id, options, cb)` - return all cards and bank accounts for the account
          * `options` _(optional)_ - Accepts `card_limit` and `bank_account_limit` keys
  * `.marketplace`
      * `.accounts(cb)` - get all of the marketplace's accounts
      * `.debits(cb)` - get all of the marketplace's debits
      * `.credits(cb)` - get all of the marketplace's credits
      * `.refunds(cb)` - get all of the marketplace's refunds
      * `.holds(cb)` - get all of the marketplace's holds

## Tests

Install mocha with `npm install mocha -g`, then run `npm test`.

## Author

C. Jordan Muir (cjm712@gmail.com), development sponsored by [HashPay](https://hashpay.com/).

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
