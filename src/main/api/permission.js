import db from '../db/models/index'
import { ipcMain } from 'electron'

ipcMain.handle('permissions', async (_) => {
  let filter = {}
  filter['raw'] = true
  filter['order'] = [['id', 'ASC'],]

  return db.permission.findAll(filter)  
})

ipcMain.handle('permissions/check', (_, userId, permission) => {
  return new Promise((resolve) => {
    db.user.hasPermission(userId, permission).then(ok => {
      resolve([ok])
    }).catch(err => {
      resolve([null, err])
    })    
  })
})