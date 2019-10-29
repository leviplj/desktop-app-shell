module.exports = (sequelize, DataTypes) => {
  const Department = sequelize.define('department', {
    name: DataTypes.STRING(50)
  }, {})
  
  return Department
}

