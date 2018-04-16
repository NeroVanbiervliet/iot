// SPDX-License-Identifier: Apache-2.0

/* 
This code was written by Zac Delventhal @delventhalz.
Original source code can be found here :https://github.com/delventhalz/transfer-chain-js/blob/master/client/src/components.js
 */

'use strict'

const $ = require('jquery')

// Add select option which may be set to selected
const addOption = (parent, value, selected = false) => {
  const selectTag = selected ? ' selected' : ''
  $(parent).append(`<option value="${value}"${selectTag}>${value}</option>`)
}

// Add a new table row with any number of cells
const addRow = (parent, ...cells) => {
  const tds = cells.map(cell => `<td>${cell}</td>`).join('')
  $(parent).append(`<tr>${tds}</tr>`)
}

module.exports = {
  addOption,
  addRow
}
