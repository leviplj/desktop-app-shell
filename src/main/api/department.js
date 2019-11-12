import db, { sequelize } from '../db/models/index'
import { ipcMain } from 'electron'

import { department as permission } from '$common/permissions'

ipcMain.handle('department', async (_, options) => {
  let filter = options || {}
  filter['raw'] = true

  return new Promise((resolve, reject) => {
    db.department.findOne(filter).then(department => {
      if (! department) 
        return resolve([null, 'Department Not Found'])

      return resolve([department])
    })    
  })  
})

ipcMain.handle('departments', (_, userId, options) => {
  return new Promise((resolve, reject) =>{
    db.user.hasPermission(userId, permission.read).then(ok => {
      let filter = options || {}
      filter['raw'] = true
      filter['order'] = [['name', 'ASC'],]

      db.department.findAll(filter).then(departments => {
        return resolve([departments])
      })
    }).catch(err => {
      return resolve([null, 'User has no permission'])
    })
  })
})

ipcMain.handle('departments/count', async (event, userId) => {
  return new Promise((resolve, reject) =>{
    db.user.hasPermission(userId, permission.read).then(ok => {
      db.department.findAll({
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

ipcMain.handle('departments/save', (_, userId, {name}) => {
  return new Promise((resolve) => {
    db.user.hasPermission(userId, permission.create).then(ok => {
      db.department.create({
        name,
      }).then(department => {  
        return resolve([department.get({plain:true})])
      }).catch(err => {
        return resolve([null, err])
      })
    }).catch(err => {
      return resolve([null, `User ${userId} has no permission`])
    })
  })
})

ipcMain.handle('departments/update', (_, userId, {id, name}) => {
  return new Promise((resolve) => {
    db.user.hasPermission(userId, permission.update).then(ok => {
      db.department.update({
        name
      }, {
        where: { id }
      }).then(affectedRows => {
        return resolve([affectedRows])
      })
    }).catch(err => {
      return resolve([null, `User ${userId} has no permission`])
    })
  })
})

ipcMain.handle('departments/delete', (_, userId, {id}) => {
  return new Promise((resolve) => {
    db.user.hasPermission(userId, permission.delete).then(ok => {
      db.department.destroy({
        where: { id }
      }).then(affectedRows => {
        return resolve([affectedRows])
      })
    }).catch(err => {
      return resolve([null, `User ${userId} has no permission`])
    })
  })
})