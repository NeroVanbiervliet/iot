/* 
Original code was written by Zac Delventhal @delventhalz.
Adapted by Nero Vanbiervliet
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

// application object
const app = { user: null, keys: [], assets: [], transfers: [], selectedAsset: null}

app.refresh = function () {
  getState((assets) => {
    this.assets = assets

    // clear existing data views
    $('#assetList').empty()
    $('[name="assetSelect"]').children().slice(1).remove()

    // populate asset view
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
    app.selectedAsset = asset
    
    // populate properties
    $('#prop-name span').html(asset.name) // .html() is jQuery for innerHTML
    $('#prop-tilted span').html(asset.tilted.toString())
    $('#prop-spoiled span').html(asset.spoiled.toString())
    $('#prop-sold span').html(asset.sold.toString())
    $('#prop-location span').html(asset.catchLat.toString() + ' , ' + asset.catchLon.toString())
    $('#prop-time span').html(asset.catchTime.toString())
    
    // fill temperature table
    $('#temperatureList').empty()
    asset.temperatures.forEach(item => {
      addRow('#temperatureList', item.time, item.temp)
    })
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

// transfer asset
$('#transferSubmit').on('click', function () {
  const asset = app.selectedAsset.name
  const owner = app.selectedAsset.owner
  if (asset && owner) app.update('transfer', asset, owner)
})

// initialise
app.user = makeKeyPair()
app.keys.push(app.user)
console.log('keys: ' + JSON.stringify(app.user))
app.refresh()
