/* 
Original code was written by Zac Delventhal @delventhalz.
Adapted by Nero Vanbiervliet
 */
 
'use strict'

const $ = require('jquery')
const { createHash } = require('crypto')
const {
  signer,
  BatchEncoder,
  TransactionEncoder
} = require('sawtooth-sdk/client')

// helper function to generate addresses based on sha512 hash function 
const getAddress = (key, length = 64) => {
  return createHash('sha512').update(key).digest('hex').slice(0, length)
}

// config variables
const KEY_NAME = 'transfer-chain.keys'
const API_URL = 'http://localhost:8081' // api of the second node

const FAMILY = 'fish'
const VERSION = '0.0'
const PREFIX = getAddress(FAMILY, 6)

// create new key-pair
const makeKeyPair = () => {
  const privateKey = signer.makePrivateKey()
  return {
    public: signer.getPublicKey(privateKey),
    private: privateKey
  }
}

// fetch current state
const getState = cb => {
  $.get(`${API_URL}/state?address=${PREFIX}`, ({ data }) => {
    let processed = data.map(d => Buffer.from(d.data, 'base64'))
    processed = processed.map(d => JSON.parse(d))
    cb(processed, [])
  })
}

// submit signed transaction to validator
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
    // any data object indicates the batch was not committed
    success: ({ data }) => cb(!data),
    error: () => cb(false)
  })
}

module.exports = {
  makeKeyPair,
  getState,
  submitUpdate
}
