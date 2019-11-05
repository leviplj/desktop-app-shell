let _permissions = []

module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('user', {
    username: DataTypes.STRING(50),
    password: DataTypes.STRING(32),
  }, {})

  User.associate = (models) => {
    User.belongsToMany(models.permission, {through: 'user_permission'})
  }

  User.hasPermission = function(id, permission) {
    return new Promise((resolve, reject) => {
      this.findOne({where: {id}}).then(user => {
        if (! user)
          return resolve(false)

        user.getPermissions({raw: true}).then(permissions => {
          if (! permissions.find(x => x.permission == permission))
            return resolve(false)

          return resolve(true)
        })
      })
    })
  }
    
  return User
}