// SPDX-License-Identifier: Apache-2.0

/* 
This code was written by Zac Delventhal @delventhalz.
Original source code can be found here: https://github.com/delventhalz/transfer-chain-js/blob/master/processor/index.js
 */


'use strict'

const {
  makeKeyPair,
  getState,
  submitUpdate
} = require('./api_interaction')

// Application Object
const app = { user: null, currentAsset: null, assets: null}

const DEFAULT_VALIDATOR_URL = 'tcp://localhost:4004'

app.createAsset = function () {
  let noFreeNameFound = true
  let id = 0
  let existingNames = app.assets.map(x => x.name)
  let newName
  while (noFreeNameFound) {
    id++
    newName = 'fish'+id
    if (!existingNames.includes(newName)) break;
  }
  console.log(newName + ' submitted to validator')
  submitUpdate({action:'create', asset:newName, owner:this.user.public}, this.user.private)
}

// Initialize
app.user = makeKeyPair()
getState(app.assets).then(function (assets) {
  app.assets = assets
  app.createAsset()
})
