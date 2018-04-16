// SPDX-License-Identifier: Apache-2.0

/* 
This code was written by Zac Delventhal @delventhalz.
Original source code can be found here: https://github.com/delventhalz/transfer-chain-js/blob/master/client/src/state.js
 */
 
'use strict'

const http = require('http')
const request = require('request');
const { createHash } = require('crypto')
const {
  signer,
  BatchEncoder,
  TransactionEncoder
} = require('sawtooth-sdk/client')

// Config variables
const API_URL = 'localhost'
const API_PORT = 8080

// Encoding helpers and constants
const getAddress = (key, length = 64) => {
  return createHash('sha512').update(key).digest('hex').slice(0, length)
}

const FAMILY = 'fish'
const PREFIX = getAddress(FAMILY, 6)

// Create new key-pair
const makeKeyPair = () => {
  const privateKey = signer.makePrivateKey()
  return {
    public: signer.getPublicKey(privateKey),
    private: privateKey
  }
}

// Fetch current Sawtooth Tuna Chain state from validator
// NEED omzetten naar request
const getState = function() {
  return new Promise(function(resolve, reject) {
    http.get(`http://${API_URL}:${API_PORT}/state?address=${PREFIX}`, (res) => {
      res.on("data", function(chunk) {
        let data = JSON.parse(chunk).data
        data = data.map(d => Buffer.from(d.data, 'base64'))
        data = data.map(d => JSON.parse(d))
        resolve(data)
      });
    })
  })
}

// Submit signed Transaction to validator
// NERO: wordt enkel 1x aangeroepen in app.js
const submitUpdate = function (payload, privateKey) {
  // create data
  const transaction = new TransactionEncoder(privateKey, {
    inputs: [PREFIX],
    outputs: [PREFIX],
    familyName: FAMILY,
    familyVersion: '0.0',
    payloadEncoding: 'application/json',
    payloadEncoder: p => Buffer.from(JSON.stringify(p))
  }).create(payload)
  const batchBytes = new BatchEncoder(privateKey).createEncoded(transaction)
  
  request.post({
      url: `http://${API_URL}:${API_PORT}/batches?wait`,
      headers: {'Content-Type': 'application/octet-stream'},
      body: batchBytes
    },
    function (error, response, body) {
        console.log(body)
    }
  );
}

module.exports = {
  makeKeyPair,
  getState,
  submitUpdate
}
