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

// helper function to get the address of an asset in the fish namespace
const getAssetAddress = name => PREFIX + getAddress(name, 58)

// gets the address of an index in the temperature array
const getArrayAddress = (assetName, arrayIndex) => {
  let baseAddr = getAssetAddress(assetName) + '01'
  return baseAddr + ("0000" + arrayIndex.toString(16)).slice(-4);
}

// gets the address of the main properties
const getMainPropsAddress = (assetName) => {
  return getAssetAddress(assetName) + '00' + '0000' // zeros split for clarity
}

// transaction family is defined by a name
const FAMILY = 'fish'
// address namespace is 3 bytes, created as first 6 hex characters of hash of family name
const PREFIX = getAddress(FAMILY, 6)

// helper functions to encode and decode binary data
const encode = obj => Buffer.from(JSON.stringify(obj, Object.keys(obj).sort()))
const decode = buf => JSON.parse(buf.toString())

// handler for action 'create'
// add a new asset to the state
const createAsset = (asset, owner, state) => { // owner == signer
  const mainPropsAddress = getMainPropsAddress(asset)

  return state.get([mainPropsAddress])
    .then(entries => {
      // check if an asset already exists on the address
      const entry = entries[mainPropsAddress] // there is only one entry because only one address was queried
      if (entry && entry.length > 0) {
        throw new InvalidTransaction('Asset name in use')
      }

      // create address for array 
      const arrayAddr = getArrayAddress(asset,0) // 0th 'index' is the entry point of the array

      // new asset is added to the state
      return state.set({
        [mainPropsAddress]: encode({name: asset, owner, tilted: false, spoiled: false, sold: false, catchLat:3.14, catchLon:3.14, catchTime:314}), // syntax: {name: asset, owner} == {name: 'value of asset', owner: 'value of owner'}
        [arrayAddr]: encode(1) // 1 is the first index to store a data point
      })
    })
}

// handler for action 'add-tilted'
const setTilted = (asset, signer, state) => {
  // TODO check that signer is owner
  
  const mainPropsAddress = getMainPropsAddress(asset)
  
  return state.get([mainPropsAddress])
    .then(entries => {
      // check if an asset exists on the address
      const entry = entries[mainPropsAddress] // there is only one entry because only one address was queried
      if (!(entry && entry.length > 0)) {
        throw new InvalidTransaction('Asset not found')
      }

      // TODO use decode() ?
      let processed = Buffer.from(entry, 'base64')
      processed = JSON.parse(processed)

      // assign new values
      processed.tilted = true
      processed.spoiled = true

      // set tilted to true and return the new state
      return state.set({
        [mainPropsAddress]: encode(processed) 
      })
    })
}

// handler for action 'transfer'
const changeOwner = (asset, signer, state) => {
  const mainPropsAddress = getMainPropsAddress(asset)
  
  return state.get([mainPropsAddress])
    .then(entries => {
      // check if an asset exists on the address
      const entry = entries[mainPropsAddress]
      if (!(entry && entry.length > 0)) {
        throw new InvalidTransaction('Asset not found')
      }

      let processed = Buffer.from(entry, 'base64')
      processed = JSON.parse(processed)

      // fish cannot be spoiled
      if (processed.spoiled) {
        throw new InvalidTransaction('Fish cannot be transfered because it is spoiled')
      }

      // set new values
      processed.owner = signer
      processed.sold = true

      // set new owner to signer of transaction
      return state.set({
        [mainPropsAddress]: encode(processed) 
      })
    })
}

// handler for action 'add-temperature'
const addTemperature = (asset, signer, state) => {
  const mainPropsAddress = getMainPropsAddress(asset.name)
  const arrayAddr = getArrayAddress(asset.name,0)
  
  return state.get([mainPropsAddress, arrayAddr])
    .then(entries => {
      // check if an asset exists on the address
      const entry = entries[mainPropsAddress]
      if (!(entry && entry.length > 0)) {
        throw new InvalidTransaction('Asset not found')
      }
      
      // check the next index of the temperature 
      const nextIndex = decode(entries[arrayAddr])  
      const nextAddr = getArrayAddress(asset.name,nextIndex)
      
      // TODO set spoiled if temperature too high

      // change next array index and set new data point
      return state.set({
        [arrayAddr]: encode(nextIndex+1),
        [nextAddr]: encode({temp: asset.temperature, time: asset.timestamp})        
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
    if (action === 'transfer') return changeOwner(asset, signer, state)
    if (action === 'add-temperature') return addTemperature(asset, signer, state)

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
