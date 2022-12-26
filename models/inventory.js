const mongoose = require('mongoose')
const Product = require('./product')

const inventorySchema = new mongoose.Schema({
  products : [Product],
  setExpense: {
    type: Boolean,
    default: false
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
})

inventorySchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id=returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})

module.exports = mongoose.model('Inventory',inventorySchema)