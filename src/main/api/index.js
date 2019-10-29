import db, { sequelize } from '../db/models/index'
import { ipcMain } from 'electron'

ipcMain.on('products', async (event, options) => {
  let filter = options || {}
  filter['order'] = [['id', 'ASC'],]
  console.log('filter', filter)

  event.returnValue = await db.product.findAll(filter).map(x => x.dataValues)
})

ipcMain.on('products/count', async (event, id) => {
  let result = await db.product.findAll({
    attributes:[[sequelize.fn('count', sequelize.col('id')), 'count']],
  })

  event.returnValue = parseInt(result[0].dataValues.count)
})

ipcMain.on('products/save', async (event, {name, price}) => {
  let result = await db.product.findAll({
    attributes:[[sequelize.fn('count', sequelize.col('id')), 'count']],
  })

  event.returnValue = parseInt(result[0].dataValues.count)
})