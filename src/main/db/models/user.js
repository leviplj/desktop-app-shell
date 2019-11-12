let _permissions = []

module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('user', {
    username: {
      type: DataTypes.STRING(50),
      unique: true,
    },
    password: DataTypes.STRING(32),
    reg_number: {
      type: DataTypes.STRING(10),
      unique: true,
    },
    is_super_user: DataTypes.BOOLEAN,
  }, {})

  User.associate = (models) => {
    User.belongsToMany(models.permission, {through: 'user_permission'})
  }

  User.hasPermission = function(id, permission) {
    return new Promise((resolve, reject) => {
      if (! this.logged_as || this.logged_as.id != id) 
        return reject(false)

      this.findOne({where: {id}}).then(user => {
        if (! user)
          return reject(false)

        if (user.is_super_user) 
          return resolve(true)

        user.getPermissions({raw: true}).then(permissions => {
          if (! permissions.find(x => x.permission == permission))
            return reject(user)

          return resolve(true)
        })
      })
    })
  }

  User.logged_as = null

  User.afterCreate(function(user) {
    user.reg_number = String(user.id).padStart(6, '0')
    console.log('user', user)

    return User.update({
      reg_number: String(user.id).padStart(6, '0')
    }, {
      where: {
        id: user.id
      },
      transaction: null
    });    
  })
    
  return User
}