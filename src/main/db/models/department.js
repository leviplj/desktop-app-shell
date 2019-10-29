module.exports = (sequelize, DataTypes) => {
  const Department = sequelize.define('department', {
    name: DataTypes.STRING(50)
  }, {})

  Department.associate = (models) => {    
    Department.hasMany(models.product, {
      foreignKey: 'departmentId',
      as: 'products',
      onDelete: 'CASCADE',
    })
  }
  
  return Department
}

