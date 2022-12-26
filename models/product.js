const mongoose = require('mongoose')
const uniqueValidator = require('mongoose-unique-validator')

const productSchema = new mongoose.Schema({
  _id: false,
  productID: {
    type: mongoose.Schema.Types.ObjectId,
    unique: true,
    require: true,
  },
  name: {
    type: String,
    minlength: [3, 'El nombre del producto debe tener mas de 3 caracteres'],
    unique: true,
    require: true
  },
  url: {
    type: String,
    require: true,
  },
  unidad: {
    type: String,
    require: true
  },
  quantity: {
    type: Number,
    default : 0
  }
})

productSchema.plugin(uniqueValidator)

productSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    delete returnedObject.__v
  }
})

module.exports = productSchema
//module.exports = mongoose.model('Product', productSchema)