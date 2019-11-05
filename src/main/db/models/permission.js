module.exports = (sequelize, DataTypes) => {
  const Permission = sequelize.define('permission', {
    permission: DataTypes.STRING(50),
  }, {})

  Permission.associate = (models) => {
    Permission.belongsToMany(models.user, {through: 'user_permission'})
  }
  
  return Permission
}