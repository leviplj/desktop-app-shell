import db, { sequelize } from '../db/models/index'
import { ipcMain } from 'electron'

ipcMain.on('products', async (event, options) => {
  let filter = options || {}
  filter['raw'] = true
  filter['order'] = [['id', 'ASC'],]
  console.log('filter', filter)

  event.returnValue = await db.product.findAll(filter)
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

ipcMain.on('products/update', async (event, {id, name, price}) => {
  let result = await db.product.update({
    name: name,
    price
  },{
    where: { 
      id: id
    }
  })

  event.returnValue = result
})

ipcMain.on('departments', async (event, options) => {
  let filter = options || {}
  filter['raw'] = true
  filter['order'] = [['id', 'ASC'],]
  console.log('filter', filter)

  event.returnValue = await db.department.findAll(filter)
})

ipcMain.on('departments/count', async (event, id) => {
  let result = await db.department.findAll({
    raw: true,
    attributes:[[sequelize.fn('count', sequelize.col('id')), 'count']],
  })

  event.returnValue = parseInt(result[0].count)
})

ipcMain.on('departments/save', async (event, {name, price}) => {
  let result = await new db.department({
    name: name,
    price: price,
    createdAt: new Date(),
    updatedAt: new Date()
  }).save()

  event.returnValue = result
})

ipcMain.on('departments/update', async (event, {id, name, price}) => {
  let result = await db.department.update({
    name: name,
    price
  },{
    where: { 
      id: id
    }
  })

  event.returnValue = result
})