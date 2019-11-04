import db from '../db/models/index'
import { ipcMain } from 'electron'

ipcMain.handle('user', async (_, options) => {  
  let filter = options || {}
  filter['raw'] = true
  filter['order'] = [['id', 'ASC'],]

  return db.user.findOne(filter)
})

ipcMain.handle('users', async (_, options) => {  
  let filter = options || {}
  filter['raw'] = true
  filter['order'] = [['id', 'ASC'],]

  if ('id' in options.where)
    return db.user.findOne(filter)
  else
    return db.user.findAll(filter)  
})

