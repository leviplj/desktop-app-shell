import db, { sequelize } from '../db/models/index'
import { ipcMain } from 'electron'
import crypto from 'crypto'

ipcMain.handle('user', async (_, options) => {
  let filter = options || {}
  filter['raw'] = true
  filter['nest'] = true
  filter['order'] = [['id', 'ASC'],]

  return new Promise((resolve, reject) => {
    db.user.findOne(filter).then(user => {
      console.log('user', user)
      if (! user) 
        return resolve(false)
      
      db.user_permission.findAll({raw: true, nest: true,where:{userId: user.id},}).then(permissions => {
        user.permissions = permissions.map(x => x.permissionId)
        resolve(user)
      })
    })    
  })  
})

ipcMain.handle('users', (_, userId, options) => {
  return new Promise((resolve, reject) =>{
    db.user.hasPermission(userId, 'user_read').then(ok => {
      if (! ok) {
        resolve([])
        return
      }

      let filter = options || {}
      filter['raw'] = true
      filter['order'] = [['username', 'ASC'],]

      resolve(db.user.findAll(filter))
    })
  })
})

ipcMain.handle('permissions', async (_) => {
  let filter = {}
  filter['raw'] = true
  filter['order'] = [['id', 'ASC'],]

  return db.permission.findAll(filter)  
})

ipcMain.on('users/count', async (event, id) => {
  let result = await db.user.findAll({
    raw: true,
    attributes:[[sequelize.fn('count', sequelize.col('id')), 'count']],
  })

  event.returnValue = parseInt(result[0].count)
})

ipcMain.handle('users/save', (_, userId, {username, password, permissions}) => {
  return new Promise((resolve) => {
    db.user.hasPermission(userId, 'user_create').then(ok => {
      if (! ok) {
        resolve({err: `User ${userId} has no permission`})
        return
      }

      db.user.create({
        username: username,
        password: crypto.createHash('md5').update(password).digest("hex"),
      }).then(user => {
        user.setPermissions(permissions)
  
        resolve(user)
      })
    })
  })
})

ipcMain.handle('users/update', (_, userId, {id, password, permissions}) => {
  return new Promise((resolve) => {
    db.user.hasPermission(userId, 'user_update').then(ok => {
      if (! ok) {
        resolve({err: `User ${userId} has no permission`})
        return
      }

      db.user.findOne({where: { id }}).then(user => {
        if (!! password)        
          user.password = crypto.createHash('md5').update(password).digest("hex")

        user.save()

        user.setPermissions(permissions)

        resolve(user)
      })
    })
  })
})

ipcMain.handle('permission', (_, userId, permission) => {
  return db.user.hasPermission(userId, permission)
})