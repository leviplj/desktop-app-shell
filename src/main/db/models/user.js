module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('user', {
    username: DataTypes.STRING(50),
    password: DataTypes.STRING(32),
  }, {})

  User.associate = (models) => {
  }
  
  return User
}