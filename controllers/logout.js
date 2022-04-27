const router = require('express').Router()

const { tokenExtractor, sessionFinder, userFinder } = require('../util/middleware')

const { Session, User } = require('../models')

router.delete('/', tokenExtractor, userFinder, sessionFinder, async (req, res) => {

  req.sessions.forEach(async session => {
    await session.destroy()
  })
  res.status(204).end()
})

router.get('/', async (req,res) => {
  const sessions = await Session.findAll({
    include: {
      model: User,
      attributes: ['name', 'username', 'disabled']
    }
  })

  res.json(sessions)
})

module.exports = router