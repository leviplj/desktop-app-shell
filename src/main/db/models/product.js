module.exports = (sequelize, DataTypes) => {
  const Product = sequelize.define('product', {
    name: DataTypes.STRING(50),
    price: DataTypes.DECIMAL(15, 4),
  }, {})
  
  return Product
}

