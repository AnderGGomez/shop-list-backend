const mongoose = require('mongoose')
const uniqueValidator = require('mongoose-unique-validator')

const userSchema = new mongoose.Schema({
  groupName: {
    type: String,
    require: true,
    minlength: [6, 'El nombre de grupe debe tener mas de 3 caracteres'],
    unique: true
  },
  username: {
    type: String,
    minlength: [3, 'El nombre de usuario debe tener mas de 3 caracteres'],
    require: true,
    unique: true,
  },
  passwordHash: {
    type: String,
    require: true,
    minlength: [8, 'La contraseñan debe tener al menos 8 caracteres']
  },
  inventory: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Inventory'
  }
})

userSchema.plugin(uniqueValidator)
userSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
    delete returnedObject.passwordHash
  }
})

module.exports = mongoose.model('User', userSchema)