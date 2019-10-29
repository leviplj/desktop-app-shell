module.exports = (sequelize, DataTypes) => {
  const Product = sequelize.define('product', {
    name: DataTypes.STRING(50),
    price: DataTypes.DECIMAL(15, 4),
    departmentId: DataTypes.INTEGER,
  }, {})

  Product.associate = (models) => {    
    Product.belongsTo(models.department, {
      foreignKey: 'departmentId',
      as: 'department',
    })
  }
  
  return Product
}