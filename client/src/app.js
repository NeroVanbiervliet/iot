// SPDX-License-Identifier: Apache-2.0

/* 
This code was written by Zac Delventhal @delventhalz. 
Original source code can be found here: https://github.com/delventhalz/transfer-chain-js/blob/master/client/src/app.js
 */
 
'use strict'

const $ = require('jquery')
const {
  makeKeyPair,
  getState,
  submitUpdate
} = require('./state')
const {
  addOption,
  addRow
} = require('./components')

// Application Object
const app = { user: null, keys: [], assets: [], transfers: [] }

app.refresh = function () {
  getState(({ assets, transfers }) => {
    this.assets = assets
    this.transfers = transfers

    // Clear existing data views
    $('#assetList').empty()
    $('#transferList').empty()
    $('[name="assetSelect"]').children().slice(1).remove()
    $('[name="transferSelect"]').children().slice(1).remove()

    // store assets for later
    app.assets = assets

    // Populate asset views
    assets.forEach(asset => {
      addRow('#assetList', asset.name, asset.owner)
      addOption('[name="assetSelect"]', asset.name)
    })
  })
}

// select asset
$('[name="assetSelect"]').on('change', function () {
  if (this.value !== 'none') {
    let asset = app.assets.find(key => key.name === this.value)
    $('#prop-name span').html(asset.name) // jQuery for innerHTML
  }
})

app.update = function (action, asset, owner) {
  if (this.user) {
    submitUpdate(
      { action, asset, owner },
      this.user.private,
      success => success ? this.refresh() : null
    )
  }
}

// Transfer Asset
$('#transferSubmit').on('click', function () {
  const asset = $('[name="assetSelect"]').val()
  const owner = $('[name="transferSelect"]').val()
  if (asset && owner) app.update('transfer', asset, owner)
})

// Initialize
app.user = makeKeyPair()
app.keys.push(app.user)
console.log('keys: ' + JSON.stringify(app.user))
app.refresh()
