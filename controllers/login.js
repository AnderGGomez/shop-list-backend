const jwt = require('jsonwebtoken')
const bcryptjs = require('bcryptjs')
const loginRouter = require('express').Router()
const User = require ('../models/user')

loginRouter.post('/', async(request, response) => {
  const { username, password } = request.body
  const user = await User.findOne({username: username})
  const passwordCorrect = user === null 
    ? false
    : await bcryptjs.compare(password, user.passwordHash )

  if( !(user && passwordCorrect)){
    return response.status(401).json({
      error: 'Invalid username or password'
    })
  }

  const userForToken = {
    username: user.username,
    id: user.id
  }

  const token = jwt.sign(userForToken, process.env.SECRET)

  response.status(200)
    .send({token, groupName: user.groupName, username: user.username})
})


module.exports = loginRouter