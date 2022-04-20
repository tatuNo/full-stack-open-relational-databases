const unknownEndpoint = (req, res) => {
  res.status(404).send({ error: 'unknown endpoint' })
}
  
const errorHandler = (error, req, res, next) => {
	//console.log('Name: ', error.name)
	//console.log('Kind: ', error.kind)
	//console.log('Message', error.message)

	if(error.name === 'SequelizeValidationError' || error.name === 'SequelizeDatabaseError') {
		return res.status(400).send({ error: error.message })
	} else if (error.message === 'Blog not found') {
		return res.status(404).send({ error: error.message })
	}

  next(error)
}
  
module.exports = {
  unknownEndpoint,
  errorHandler
}