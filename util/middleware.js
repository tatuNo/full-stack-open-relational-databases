const { Blog, User, Session } = require('../models')
const { SECRET } = require('./config')
const jwt = require('jsonwebtoken')

const sessionFinder = async (req, res, next) => {

  req.sessions = await Session.findAll({
    where: {
      userId: req.user.id
    },
    include: {
      model: User,
      attributes: ['disabled']
    }
  })
  
  if(!req.sessions.length) {
    const error = new Error('Session expired')
    error.name = 'SessionNotFound'
    throw error
  }

  next()
}

const blogFinder = async (req, res, next) => {
  req.blog = await Blog.findByPk(req.params.id)

  if(!req.blog) throw new Error('Blog not found')
  
  next()
}

const userFinder = async (req, res, next) => {
  const decodedToken = jwt.verify(req.token, SECRET)
  req.user = await User.findByPk(decodedToken.id)

  if(!req.user) throw new Error('User not found')
  if(req.user.disabled) throw new Error('Account disabled, please contact admin')

  next()
}

const tokenExtractor = (req, res, next) => {
  const authorization = req.get('authorization')
  if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
    req.token = authorization.substring(7)
  }
  next()
}

const unknownEndpoint = (req, res) => {
  res.status(404).send({ error: 'unknown endpoint' })
}
  
const errorHandler = (error, req, res, next) => {

  if(error.name === 'SequelizeValidationError' || error.name === 'SequelizeDatabaseError') {
    return res.status(400).send({ error: error.message })
  } else if (error.message === 'Blog not found' || error.message === 'User not found') {
    return res.status(404).send({ error: error.message })
  } else if (error.name === 'JsonWebTokenError') {
    return res.status(401).json({ error: 'missing or invalid token' })
  } else if (error.name === 'SequelizeForeignKeyConstraintError') {
    return res.status(400).json({ error: error.message })
  } else if(error.name ==='SessionNotFound') {
    return res.status(440).json({ error: error.message })
  } else if (error.message === 'Account disabled, please contact admin') {
    return res.status(401).json({ error: error.message })
  }

  next(error)
}
  
module.exports = {
  unknownEndpoint,
  errorHandler,
  tokenExtractor,
  blogFinder,
  userFinder,
  sessionFinder
}