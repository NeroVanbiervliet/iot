// SPDX-License-Identifier: Apache-2.0

/* 
This code was written by Zac Delventhal @delventhalz.
Original source code can be found here: https://github.com/delventhalz/transfer-chain-js/blob/master/processor/handlers.js
 */

'use strict'

const { createHash } = require('crypto')
const { TransactionHandler } = require('sawtooth-sdk/processor')
const { InvalidTransaction } = require('sawtooth-sdk/processor/exceptions')
const { TransactionHeader } = require('sawtooth-sdk/protobuf')

// Encoding helpers and constants
const getAddress = (key, length = 64) => {
  return createHash('sha512').update(key).digest('hex').slice(0, length)
}

const FAMILY = 'transfer-chain'
const PREFIX = getAddress(FAMILY, 6)

const getAssetAddress = name => PREFIX + '00' + getAddress(name, 62)
const getTransferAddress = asset => PREFIX + '01' + getAddress(asset, 62)

// NERO: buffers worden gebruikt om streams van binaire data te handlen
const encode = obj => Buffer.from(JSON.stringify(obj, Object.keys(obj).sort()))
const decode = buf => JSON.parse(buf.toString())

// Add a new asset to state
const createAsset = (asset, owner, state) => {
  const address = getAssetAddress(asset)

  return state.get([address])
    .then(entries => {
      // NERO: check of er al een asset is op dat address
      const entry = entries[address]
      if (entry && entry.length > 0) {
        throw new InvalidTransaction('Asset name in use')
      }

      // NERO: nieuw asset wordt in state gezet
      return state.set({
        [address]: encode({name: asset, owner})
      })
    })
}

// Add a new transfer to state
const transferAsset = (asset, owner, signer, state) => {
  const address = getTransferAddress(asset)
  const assetAddress = getAssetAddress(asset)

  return state.get([assetAddress])
    .then(entries => {
      // NERO: check if asset exists
      const entry = entries[assetAddress]
      if (!entry || entry.length === 0) {
        throw new InvalidTransaction('Asset does not exist')
      }

      // NERO: singer moet de huidige eigenaar zijn
      if (signer !== decode(entry).owner) {
        throw new InvalidTransaction('Only an Asset\'s owner may transfer it')
      }

      // NERO: nieuwe eigenaar wordt gezet
      return state.set({
        [address]: encode({asset, owner})
      })
    })
}

// Accept a transfer, clearing it and changing asset ownership
// NERO: transfers moeten accepted worden door nieuwe eigenaar, kunnen niet zomaar gepushed worden
const acceptTransfer = (asset, signer, state) => {
  const address = getTransferAddress(asset)

  return state.get([address])
    .then(entries => {
      // NERO: checken of er wel een transfer openstaat
      const entry = entries[address]
      if (!entry || entry.length === 0) {
        throw new InvalidTransaction('Asset is not being transfered')
      }

      // NERO: niet nodig, is al gecheckt in transferAsset functie
      if (signer !== decode(entry).owner) {
        throw new InvalidTransaction(
          'Transfers can only be accepted by the new owner'
        )
      }

      // NERO: op address (niet transferAddress!) wordt owner veranderd
      return state.set({
        [address]: Buffer(0),
        [getAssetAddress(asset)]: encode({name: asset, owner: signer})
      })
    })
}

// Reject a transfer
const rejectTransfer = (asset, signer, state) => {
  const address = getTransferAddress(asset)

  return state.get([address])
    .then(entries => {
      const entry = entries[address]
      if (!entry || entry.length === 0) {
        throw new InvalidTransaction('Asset is not being transfered')
      }

      if (signer !== decode(entry).owner) {
        throw new InvalidTransaction(
          'Transfers can only be rejected by the potential new owner')
      }

      // NERO: 0 = clearen van data op address (=leeg)
      return state.set({
        [address]: Buffer(0)
      })
    })
}

// Handler for JSON encoded payloads
// NERO: dit is wat ook logging in console doet
class JSONHandler extends TransactionHandler {
  constructor () {
    console.log('Initializing JSON handler for Sawtooth Tuna Chain')
    super(FAMILY, '0.0', 'application/json', [PREFIX])
  }

  apply (txn, state) {
    // Parse the transaction header and payload
    const header = TransactionHeader.decode(txn.header)
    console.log(header)
    const signer = header.signerPubkey
    const { action, asset, owner } = JSON.parse(txn.payload) // NERO zie app.js wat payload is

    // Call the appropriate function based on the payload's action
    console.log(`Handling transaction:  ${action} > ${asset}`,
                owner ? `> ${owner.slice(0, 8)}... ` : '',
                `:: ${signer.slice(0, 8)}...`)

    // NERO: hier worden de functies van hierboven gecalled!
    if (action === 'create') return createAsset(asset, signer, state)
    if (action === 'transfer') return transferAsset(asset, owner, signer, state)
    if (action === 'accept') return acceptTransfer(asset, signer, state)
    if (action === 'reject') return rejectTransfer(asset, signer, state)

    return Promise.resolve().then(() => {
      throw new InvalidTransaction(
        'Action must be "create", "transfer", "accept", or "reject"'
      )
    })
  }
}

module.exports = {
  JSONHandler
}
