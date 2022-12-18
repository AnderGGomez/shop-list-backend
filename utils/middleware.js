const logger = require('./logger')

const errorHandler = (error, request, response, next) => {
  if (error.name === 'CastError'){
    return response.status(404).json({error: error.message})
  }
  if(error.name === 'ValidationError'){
    return response.status(400).json({error:error.message})
  }
  if(error.name === 'JsonWebTokenError'){
    return response.status(401).json({error: 'invalid token'})
  }
  logger.error({error: error.message})
  next(error)
}

const tokenExtractor = (request, response, next) => {
  const authorization = request.get('Authorization')
  if(authorization){
    const tkn = authorization.split(' ')
    request.token = tkn[1]
  }
  next()
}

module.exports = {
  errorHandler,
  tokenExtractor
}