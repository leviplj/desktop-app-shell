import db, { sequelize } from '../db/models/index'
import { ipcMain } from 'electron'
import crypto from 'crypto'

ipcMain.handle('user', async (_, options) => {
  let filter = options || {}
  filter['raw'] = true

  return new Promise((resolve, reject) => {
    db.user.findOne(filter).then(user => {
      if (! user) 
        return resolve([null, 'User Not Found'])
 
      db.user_permission.findAll({raw: true, nest: true,where:{userId: user.id},}).then(permissions => {
        user.permissions = permissions.map(x => x.permissionId)
        resolve([user])
      })
    })    
  })  
})

ipcMain.handle('users/login', async (_, options) => {
  let filter = options || {}
  filter['raw'] = true

  return new Promise((resolve, reject) => {
    db.user.findOne(filter).then(user => {
      if (! user)
        return resolve([null, 'User Not Found'])
        db.user.logged_as = user

        db.user.hasPermission(user.id, 'system_login').then(ok => {
          return resolve([user])
        }).catch(err => {
          return resolve([null, 'User has no permission'])          
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

ipcMain.handle('users/count', async (event, id) => {
  return new Promise((resolve) =>{
    db.user.findAll({
      raw: true,
      attributes:[[sequelize.fn('count', sequelize.col('id')), 'count']],
    }).then(result => {
      resolve(parseInt(result[0].count))
    })
  })
})

ipcMain.handle('users/save', (_, userId, {username, password, is_super_user, permissions}) => {
  return new Promise((resolve) => {
    db.user.hasPermission(userId, 'user_create').then(ok => {
      if (! ok) {
        resolve([null, `User ${userId} has no permission`])
        return
      }

      db.user.create({
        username,
        password: crypto.createHash('md5').update(password).digest("hex"),
        is_super_user,
      }).then(user => {
        user.setPermissions(permissions)
  
        resolve([user])
      }).catch(err => {
        resolve([null, err])
      })
    })
  })
})

ipcMain.handle('users/update', (_, userId, {id, password, is_super_user, permissions}) => {
  return new Promise((resolve) => {
    db.user.hasPermission(userId, 'user_update').then(ok => {
      if (! ok) {
        resolve({err: `User ${userId} has no permission`})
        return
      }

      db.user.findOne({where: { id }}).then(user => {
        if (!! password)        
          user.password = crypto.createHash('md5').update(password).digest("hex")
        
        user.is_super_user = is_super_user

        user.save()

        user.setPermissions(permissions)

        resolve(user)
      })
    })
  })
})

ipcMain.handle('permission', (_, userId, permission) => {
  return new Promise((resolve) => {
    db.user.hasPermission(userId, permission).then(ok => {
      resolve([ok])
    }).catch(err => {
      resolve([null, err])
    })    
  })
})