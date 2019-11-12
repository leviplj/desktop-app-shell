import db, { sequelize } from '../db/models/index'
import { ipcMain } from 'electron'

ipcMain.handle('departments', (event, options) => {
  let filter = options || {}
  filter['raw'] = true
  filter['order'] = [['id', 'ASC'],]

  return db.department.findAll(filter)
})

ipcMain.handle('departments/count', async (event, id) => {
  return new Promise((resolve) =>{
    db.department.findAll({
      raw: true,
      attributes:[[sequelize.fn('count', sequelize.col('id')), 'count']],
    }).then(result => {
      resolve(parseInt(result[0].count))
    })
  })
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