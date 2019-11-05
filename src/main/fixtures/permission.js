import db from '../db/models/index'
import perm from '$common/perm'
import crypto from 'crypto'

let permission = function(obj) {
  return Object.keys(obj)
    .filter(x => typeof(obj[x]) !== 'function')
    .map(x => obj[x])
}

let arr = Object.keys(perm).reduce((acc, cur) => {
  permission(perm[cur]).map(x => {
    acc.push({permission: x})
  })

  return acc
}, [])

db.permission.bulkCreate(
  arr
)

db.user.create({username: 'foodinn2', password: crypto.createHash('md5').update('123').digest("hex")}).then(user => {
  db.permission.findAll().then(permissions => {
    user.addPermissions(permissions)
  })
})