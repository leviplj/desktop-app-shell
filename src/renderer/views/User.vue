<template>
  <div>
    <h1>User Form</h1>
    <div class="container">
        <input-field id="reg_number" placeholder="Reg. No." v-model="reg_number" :readonly="true"/>
        <input-field id="username" placeholder="Username" v-model="username" :readonly="$route.params.id? true: false"/>
        <input-field id="password" placeholder="Password" type="password" v-model="password"/>
        <input type="checkbox" v-model="is_super_user" id="is_super_user">Super User<br>
        <hr>
        <span>Permissions</span><br>
        <div v-for="item in permission_list" :key="item.id">
        <input type="checkbox" v-model="permissions" id="permissions" :value="item.id">{{item.permission}}<br>
        </div>

        <div class="form-control">
          <base-button type="success" @click.native="save()">Save</base-button>
          <base-button v-if="id" type="primary" @click.native="confirmRemoval()">Delete</base-button>
          <base-button type="link" @click.native="navigate('/users')">Cancel</base-button>
        </div>

        <div v-if="errors">
          <span v-for="error in errors" :key="error">{{error}}</span>
        </div>
    </div>
  </div>
</template>

<script>
  import NavMixin from '@/mixins/NavMixin'
  import InputField from '@/components/InputField'
  import BaseButton from '@/components/button/BaseButton'
  import { ipcRenderer } from 'electron'
  
  export default {
    name: 'user-form',
    components: { InputField, BaseButton },
    mixins: [ NavMixin ],
    data() {
      return {
        id: null,
        username: '',
        password: '',
        reg_number: '',
        is_super_user: false,
        permissions: [],
        permission_list: [],
        exit: false,
        errors: []
      }
    },
    methods: {
      setId: function(id) {
        this.id = id
        
        ipcRenderer.invoke('user', {
          where: {id: this.id}
        }).then(([user, err])=> {
          if (err) {
            this.errors = [err]
            return
          }

          this.username = user.username
          this.permissions = user.permissions
          this.reg_number = user.reg_number
          this.is_super_user = user.is_super_user
        })
      },
      create: function() {
        ipcRenderer.invoke('users/save', localStorage.getItem('userId'), {
          username: this.username,
          password: this.password,
          is_super_user: this.is_super_user,
          permissions: this.permissions,
        }).then(([user, err]) => {
          if (err) 
            return this.errors = [err]
          
          this.exit = true
          this.navigate({path: '/users', query: { id: user.id, reg_number: user.reg_number }})
        })
        .catch(err => {
          console.log('Unexpected error', err.message)
        })
      },
      update: function() {
        ipcRenderer.invoke('users/update', localStorage.getItem('userId'), {
          id: this.$route.params.id,
          username: this.username,
          password: this.password,
          is_super_user: this.is_super_user,
          permissions: this.permissions,
        }).then(([user, err]) => {
          console.log('update', user)
          if (err) {
            this.errors = [err]
            return 
          }
          
          this.exit = true
          this.navigate('/users')
        })
        .catch(err => {
          console.log('Unexpected error', err.message)
        })
      },
      validate: function() {
        this.errors = []
        if (! this.name) {
          this.errors.push('Name is required')
        }
        console.log(this.errors)

        if (!! this.errors.length)
          return false

        return true
      },
      save: function() {
        if (! this.validate())
          return        

        if (this.$route.params.id !== undefined) 
          this.update()
        else
          this.create()
      },
      confirmRemoval: function() {
        this.$dialog.confirm('Confirm deleting this user?')
          .then(() => {
            this.remove()
          })
      },
      remove: function() {
        ipcRenderer.invoke('users/delete', localStorage.getItem('userId'), {
          id: this.$route.params.id,
        }).then(([affectedRows, err]) => {
          console.log('removed', [affectedRows, err])
          if (err) {
            this.errors = [err]
            return 
          }
        
          this.exit = true
          this.navigate({path: '/users'})
        })
        .catch(err => {
          console.log('Unexpected error', err.message)
        })
      },
      canLeave: function() {
        if (this.exit) 
          return true
        return this.username === ''
      }
    }, 
    mounted() {
      ipcRenderer.invoke('permissions').then(result => {
        this.permission_list = result
      })

      if (this.$route.params.id !== undefined) {
        this.setId(this.$route.params.id)
      }
    },
    beforeRouteLeave (to, from, next) {
      if (this.canLeave()) {
        next()
      } else {
        this.$dialog.confirm('All your data will be lost. Proceed?')
          .then(function () {
            next()
          })
          .catch(function () {
            next(false)
          })
      }
		},
  }
</script>

<style lang="scss">
 .form-control {
    display: flex;
    justify-content: space-around;
    align-content: center;
 }
</style>