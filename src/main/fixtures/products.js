import db from '../db/models/index'

db.product.bulkCreate(
  Array(20).fill(1).map((v, i) => v + i).map(v => {return {
    name: `Product ${v}`,
    price: v,
    createdAt: new Date(),
    updatedAt: new Date()
  }})
)