const { Model, DataTypes } = require('sequelize')

const { sequelize } = require('../util/db')

class Blog extends Model {}

Blog.init({
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  author: {
    type: DataTypes.TEXT,
    allowNull: false,
    validate: {
      notNull: {
        msg: 'Please enter blog url'
      }
    }
  },
  url: {
    type: DataTypes.TEXT,
    allowNull: false,
    validate: {
      notNull: {
        msg: 'Please enter password'
      },
      isUrl: {
        msg: 'Enter url in correct format (https://foo.com)'
      }
    }
  },
  title: {
    type: DataTypes.TEXT,
    allowNull: false,
    validate: {
      notNull: {
        msg: 'Please enter blog title'
      }
    }
  },
  likes: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
    validate: {
      isInt: {
        msg: 'Must be integer'
      }
    }
  },
  year: {
    type: DataTypes.INTEGER,
    validate: {
      isInt: {
        msg: 'Must be integer'
      },
      validateYear(value) {
        const currentYear = new Date().getFullYear()
        if(parseInt(value) > currentYear || parseInt(value) < 1991) throw new Error(`Year range 1991 - ${currentYear}`)
      }
    }
  }
}, {
  sequelize,
  underscored: true,
  modelName: 'blog'
})

module.exports = Blog