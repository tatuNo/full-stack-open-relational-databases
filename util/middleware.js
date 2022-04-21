const { Blog } = require('../models')

const blogFinder = async (req, res, next) => {
  req.blog = await Blog.findByPk(req.params.id)
	if(!req.blog) {
		throw new Error('Blog not found')
	}
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
  }

  next(error)
}
  
module.exports = {
  unknownEndpoint,
  errorHandler,
	tokenExtractor,
	blogFinder
}