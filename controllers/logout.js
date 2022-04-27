const router = require('express').Router()

const { tokenExtractor, sessionFinder, userFinder } = require('../util/middleware')

router.delete('/', tokenExtractor, userFinder, sessionFinder, async (req, res) => {

  req.sessions.forEach(async session => {
    await session.destroy()
  })
  
  res.status(204).end()
})

module.exports = router