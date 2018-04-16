// SPDX-License-Identifier: Apache-2.0

/* 
This code was written by Zac Delventhal @delventhalz.
Original source code can be found here: https://github.com/delventhalz/transfer-chain-js/blob/master/client/src/state.js
 */
 
'use strict'

const $ = require('jquery')
const {
  signer,
  BatchEncoder,
  TransactionEncoder
} = require('sawtooth-sdk/client')

// Config variables
const KEY_NAME = 'transfer-chain.keys'
const API_URL = 'http://localhost:8080'

const FAMILY = 'transfer-chain'
const VERSION = '0.0'
const PREFIX = '19d832'

// Create new key-pair
const makeKeyPair = () => {
  const privateKey = signer.makePrivateKey()
  return {
    public: signer.getPublicKey(privateKey),
    private: privateKey
  }
}

// Fetch current Sawtooth Tuna Chain state from validator
const getState = cb => {
  $.get(`${API_URL}/state?address=${PREFIX}`, ({ data }) => {
    cb(data.reduce((processed, datum) => {
      if (datum.data !== '') {
        const parsed = JSON.parse(atob(datum.data))
        if (datum.address[7] === '0') processed.assets.push(parsed)
        if (datum.address[7] === '1') processed.transfers.push(parsed)
      }
      return processed
    }, {assets: [], transfers: []}))
  })
}

// Submit signed Transaction to validator
// NERO: wordt enkel 1x aangeroepen in app.js
const submitUpdate = (payload, privateKey, cb) => {
  const transaction = new TransactionEncoder(privateKey, {
    inputs: [PREFIX],
    outputs: [PREFIX],
    familyName: FAMILY,
    familyVersion: VERSION,
    payloadEncoding: 'application/json',
    payloadEncoder: p => Buffer.from(JSON.stringify(p))
  }).create(payload)

  const batchBytes = new BatchEncoder(privateKey).createEncoded(transaction)

  $.post({
    url: `${API_URL}/batches?wait`,
    data: batchBytes,
    headers: {'Content-Type': 'application/octet-stream'},
    processData: false,
    // Any data object indicates the Batch was not committed
    success: ({ data }) => cb(!data),
    error: () => cb(false)
  })
}

module.exports = {
  makeKeyPair,
  getState,
  submitUpdate
}
