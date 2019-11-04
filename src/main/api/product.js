import db, { sequelize } from '../db/models/index'
import { ipcMain } from 'electron'

ipcMain.handle('products', async (event, options) => {
  console.log(`products`)
  let filter = options || {}
  filter['raw'] = true
  filter['nest'] = true
  filter['order'] = [['id', 'ASC'],]
  filter['include']= [{
    model: db.department,
    as: 'department',
    attributes: ['name'],
  }]
  
  return db.product.findAll(filter)
})

ipcMain.on('products/count', async (event, id) => {
  let result = await db.product.findAll({
    raw: true,
    attributes:[[sequelize.fn('count', sequelize.col('id')), 'count']],
  })

  event.returnValue = parseInt(result[0].count)
})

ipcMain.on('products/save', async (event, {name, price}) => {
  let result = await new db.product({
    name: name,
    price: price,
    createdAt: new Date(),
    updatedAt: new Date()
  }).save()

  event.returnValue = result
})

ipcMain.on('products/update', async (event, {id, name, price, departmentId}) => {
  try{
    let result = await db.product.update({
      name,
      price,
      departmentId,
    },{
      where: { 
        id
      }
    })

    event.returnValue = result
  } catch(err){
    console.log(err)
    event.returnValue = null
  }
})