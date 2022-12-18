const mongoose = require('mongoose')
const uniqueValidator = require('mongoose-unique-validator')

const productSchema = new mongoose.Schema({
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
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})

module.exports = productSchema
//module.exports = mongoose.model('Product', productSchema)