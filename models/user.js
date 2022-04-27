const { Model, DataTypes } = require('sequelize')

const { sequelize } = require('../util/db')

class User extends Model {}

User.init({
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  username: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      isEmail: {
        msg: 'Enter username in correct format (foo@bar.com)'
      }
    }
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notNull: {
        msg: 'Please enter your name'
      }
    }
  },
  passwordHash: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notNull: {
        msg: 'Please enter password'
      }
    }
  },
  disabled: {
    type: DataTypes.BOOLEAN,
    default: false
  }
}, {
  hooks: {
    afterCreate: (record, options) => {
      delete record.dataValues.passwordHash
    },
    afterUpdate: (record, options) => {
      delete record.dataValues.passwordHash
    }
  },
  sequelize,
  underscored: true,
  modelName: 'user'
})

module.exports = User