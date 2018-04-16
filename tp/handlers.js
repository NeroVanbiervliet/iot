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

const FAMILY = 'fish'
const PREFIX = getAddress(FAMILY, 6)

const getAssetAddress = name => PREFIX + getAddress(name, 66)

// NERO: buffers worden gebruikt om streams van binaire data te handlen
const encode = obj => Buffer.from(JSON.stringify(obj, Object.keys(obj).sort()))
const decode = buf => JSON.parse(buf.toString())

// Add a new asset to state
const createAsset = (asset, owner, state) => {
  const address = getAssetAddress(asset)

  return state.get([address])
    .then(entries => {
      // NERO: check of er al een asset is op dat address
      const entry = entries[address] // er is maar 1 entry want maar 1 address gegeven
      if (entry && entry.length > 0) {
        throw new InvalidTransaction('Asset name in use')
      }

      // NERO: nieuw asset wordt in state gezet
      return state.set({
        [address]: encode({name: asset, owner})
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
    const signer = header.signerPubkey
    const { action, asset, owner } = JSON.parse(txn.payload) // NERO zie app.js wat payload is

    // Call the appropriate function based on the payload's action
    console.log(`Handling transaction:  ${action} > ${asset}`,
                owner ? `> ${owner.slice(0, 8)}... ` : '',
                `:: ${signer.slice(0, 8)}...`)

    // NERO: aan elk type action wordt de juiste handler gekoppeld
    if (action === 'create') return createAsset(asset, signer, state)

    // NERO: geen van de actions was een match
    return Promise.resolve().then(() => {
      throw new InvalidTransaction(
        'Action must be "create"'
      )
    })
  }
}

module.exports = {
  JSONHandler
}
