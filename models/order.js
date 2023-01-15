const mongoose = require('mongoose')
const Product = require('./product')
const orderSchema = new mongoose.Schema({
  products : [
    {
      _id:false,
      productID: {
       type: mongoose.Schema.Types.ObjectId,
       ref: 'Products'
      },
      name: String, 
      url: String, 
      unidad: String, 
      quantity: Number
    }
  ],
  inventory: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Inventory'
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
},
{
  timestamps: true
})

orderSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id=returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})

module.exports = mongoose.model('Order',orderSchema)