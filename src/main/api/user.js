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
        return resolve([user])
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
      let filter = options || {}
      filter['raw'] = true
      filter['order'] = [['username', 'ASC'],]

      db.user.findAll(filter).then(users => {
        return resolve([users])
      })
    }).catch(err => {
      return resolve([null, 'User has no permission'])
    })
  })
})

ipcMain.handle('users/count', async (event, userId) => {
  return new Promise((resolve, reject) =>{
    db.user.hasPermission(userId, 'user_read').then(ok => {
      db.user.findAll({
        raw: true,
        attributes:[[sequelize.fn('count', sequelize.col('id')), 'count']],
      }).then(result => {
        return resolve([parseInt(result[0].count)])
      })
    }).catch(err => {
      return resolve([null, 'User has no permission'])
    })
  })
})

ipcMain.handle('users/save', (_, userId, {username, password, is_super_user, permissions}) => {
  return new Promise((resolve) => {
    db.user.hasPermission(userId, 'user_create').then(ok => {
      db.user.create({
        username,
        password: crypto.createHash('md5').update(password).digest("hex"),
        is_super_user,
      }).then(user => {
        user.setPermissions(permissions)
  
        return resolve([user.get({plain:true})])
      }).catch(err => {
        return resolve([null, err])
      })
    }).catch(err => {
      return resolve([null, `User ${userId} has no permission`])
    })
  })
})

ipcMain.handle('users/update', (_, userId, {id, password, is_super_user, permissions}) => {
  return new Promise((resolve) => {
    db.user.hasPermission(userId, 'user_update').then(ok => {
      db.user.findOne({where: { id }}).then(user => {
        if (!! password)        
          user.password = crypto.createHash('md5').update(password).digest("hex")
        
        user.is_super_user = is_super_user

        user.save()

        user.setPermissions(permissions)

        return resolve([user])
      })
    }).catch(err => {
      return resolve([null, `User ${userId} has no permission`])
    })
  })
})

ipcMain.handle('users/delete', (_, userId, {id}) => {
  return new Promise((resolve) => {
    db.user.hasPermission(userId, 'user_delete').then(ok => {

      db.user.destroy({
        where: {
          id
        }
      }).then(affectedRows => {
        return resolve([affectedRows])
      })
    }).catch(err => {
      return resolve([null, `User ${userId} has no permission`])
    })
  })
})