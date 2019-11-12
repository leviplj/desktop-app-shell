import db from '../db/models/index'
import crypto from 'crypto'

db.user.bulkCreate([
  {username: 'foodinn', password: crypto.createHash('md5').update('123').digest("hex"), is_super_user: true, reg_number: '000001'},
])