/* 
Original code was written by Zac Delventhal @delventhalz.
Adapted by Nero Vanbiervliet
 */

'use strict'

const { createHash } = require('crypto')
const { TransactionHandler } = require('sawtooth-sdk/processor')
const { InvalidTransaction } = require('sawtooth-sdk/processor/exceptions')
const { TransactionHeader } = require('sawtooth-sdk/protobuf')

// helper function to generate addresses based on sha512 hash function 
const getAddress = (key, length = 64) => {
  return createHash('sha512').update(key).digest('hex').slice(0, length)
}

// transaction family is defined by a name
const FAMILY = 'fish'
// address namespace is 3 bytes, created as first 6 hex characters of hash of family name
const PREFIX = getAddress(FAMILY, 6)
// helper function to get an address in the fish namespace
const getAssetAddress = name => PREFIX + getAddress(name, 64)

// helper functions to encode and decode binary data
const encode = obj => Buffer.from(JSON.stringify(obj, Object.keys(obj).sort()))
const decode = buf => JSON.parse(buf.toString())

// handler for action 'create'
// add a new asset to the state
const createAsset = (asset, owner, state) => { // owner == signer
  const address = getAssetAddress(asset)

  return state.get([address])
    .then(entries => {
      // check if an asset already exists on the address
      const entry = entries[address] // there is only one entry because only one address was queried
      if (entry && entry.length > 0) {
        throw new InvalidTransaction('Asset name in use')
      }

      // new asset is added to the state
      return state.set({
        [address]: encode({name: asset, owner, tilted: false}) // == {name: 'value of asset', owner: 'value of owner', tilted: false}
      })
    })
}

// handler for action 'add-tilted'
const setTilted = (asset, signer, state) => {
  // TODO check that signer is owner
  
  const address = getAssetAddress(asset)
  
  return state.get([address])
    .then(entries => {
      // check if an asset exists on the address
      const entry = entries[address] // there is only one entry because only one address was queried
      if (!(entry && entry.length > 0)) {
        throw new InvalidTransaction('Asset not found')
      }

      let processed = Buffer.from(entry, 'base64')
      processed = JSON.parse(processed)

      // set tilted to true and return the new state
      return state.set({
        [address]: encode({name: processed.name, owner: processed.owner, tilted: true}) 
      })
    })
}

class JSONHandler extends TransactionHandler {
  constructor () {
    console.log('Initializing JSON handler for Sawtooth Tuna Chain')
    super(FAMILY, '0.0', 'application/json', [PREFIX]) // 0.0 = version of family
  }

  // this function is called by the transaction processor when new transaction needs to be handled
  apply (txn, state) {
    // parse the transaction header and payload
    const header = TransactionHeader.decode(txn.header)
    const signer = header.signerPubkey
    const { action, asset, owner } = JSON.parse(txn.payload)

    // call the appropriate function based on the payload's action
    console.log(`Handling transaction:  ${action} > ${asset}`,
                owner ? `> ${owner.slice(0, 8)}... ` : '',
                `:: ${signer.slice(0, 8)}...`)

    // depending on the type, the correct handler is called
    if (action === 'create') return createAsset(asset, signer, state)
    if (action === 'add-tilted') return setTilted(asset, signer, state)
    // to be added: handlers for e.g. action === 'add-temperature' or action === 'sell'

    // no handler function was found for the action
    return Promise.resolve().then(() => {
      throw new InvalidTransaction(
        'Action must be "create"' // list to be expanded when more actions are created
      )
    })
  }
}

module.exports = {
  JSONHandler
}
