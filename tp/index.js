// SPDX-License-Identifier: Apache-2.0

/* 
This code was written by Zac Delventhal @delventhalz.
Original source code can be found here: https://github.com/delventhalz/transfer-chain-js/blob/master/processor/index.js
 */


'use strict'

const { TransactionProcessor } = require('sawtooth-sdk/processor')
const { JSONHandler } = require('./handlers')

const DEFAULT_VALIDATOR_URL = 'tcp://localhost:4004'
let validatorUrl;

if (process.argv.length < 3) {
  console.log('No validator url passed as argument, defaulting to: ' + DEFAULT_VALIDATOR_URL)
  validatorUrl = DEFAULT_VALIDATOR_URL
}
else {
  validatorUrl = process.argv[2]
}

// Initialize Transaction Processor
const tp = new TransactionProcessor(VALIDATOR_URL)
tp.addHandler(new JSONHandler())
tp.start()
