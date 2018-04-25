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
    let filtered = data.filter(d => d.address.slice(-6).slice(0,2) == '00') // remove array addresses '01'
    let addresses = filtered.map(d => d.address.slice(0,54)) // slice common part of address
  
    // process the main properties
    let processed = filtered.map(d => Buffer.from(d.data, 'base64')) // extract data and decode
    processed = processed.map(d => JSON.parse(d))
    for (let i=0; i<processed.length; i++) {
      processed[i].temperatures = [] // initialise temperature list
    }
    
    // process the array addresses
    filtered = data.filter(d => d.address.slice(-6).slice(0,2) == '01')
    filtered = data.filter(d => d.address.slice(-4) != '0000') // remove index indicators
    for (let dataPoint of filtered) {
      // get index of address
      let ind = addresses.indexOf(dataPoint.address.slice(0,54))
      processed[ind].temperatures.push(JSON.parse(Buffer.from(dataPoint.data, 'base64')))
    }
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
