/* 
Original code was written by Zac Delventhal @delventhalz.
Adapted by Nero Vanbiervliet
 */


'use strict'

const {
  makeKeyPair,
  getState,
  submitUpdate
} = require('./api_interaction')

// application object
const app = { user: null, currentAsset: null, assets: null}

// creates a new fish asset
// first checks the state for the next free name: fish1, fish2, fish3...
app.createAsset = function () {
  let id = 0
  let existingNames = app.assets.map(x => x.name)
  let newName
  while (true) {
    id++
    newName = 'fish'+id
    if (!existingNames.includes(newName)) break;
  }
  console.log(newName + ' submitted to validator')
  // submit new asset to api
  submitUpdate({action:'create', asset:newName, owner:this.user.public}, this.user.private)
}

// initialise
app.user = makeKeyPair()
getState(app.assets).then(function (assets) {
  app.assets = assets
  // new asset is created upon running the script
  app.createAsset()
})
