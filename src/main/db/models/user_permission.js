module.exports = (sequelize, DataTypes) => {
  const UserPermission = sequelize.define('user_permission', {
    userId: DataTypes.INTEGER,
    permissionId: DataTypes.INTEGER,
  }, {})

  UserPermission.associate = (models) => {    
    
  }
  
  return UserPermission
}