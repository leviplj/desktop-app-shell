import db from '../db/models/index'

db.department.bulkCreate(
  Array(20).fill(1).map((v, i) => v + i).map(v => {return {
    name: `Department ${v}`,
    createdAt: new Date(),
    updatedAt: new Date()
  }})
)