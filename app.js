const config = require('./utils/config')
const logger = require('./utils/logger')
const express = require('express')
require('express-async-errors')
const app = express()
const cors = require('cors')
const userRouter = require('./controllers/user')
const loginRouter = require('./controllers/login')
const inventoryRouter = require('./controllers/inventory')
const middleware = require('./utils/middleware')
const mongoose = require('mongoose')

mongoose.connect(config.MONGODB_URI)
  .then(() => {
    logger.info('Connected to MongoDB')
  })
  .catch(error => {
    logger.error('Error connecting to MongoDB', error.message)
  })

app.use(cors())
app.use(express.json())
app.use(middleware.tokenExtractor)
app.use('/api/users',userRouter)
app.use('/api/login', loginRouter)
app.use('/api/inventory',inventoryRouter)
/*
if (process.env.NODE_ENV === 'test') {
  const testingRouter = require('./controllers/testing')
  app.use('/api/testing',testingRouter)
}
*/

app.use(middleware.errorHandler)
module.exports=app