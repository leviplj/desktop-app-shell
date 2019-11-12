<template>
  <div>
    <h1>User Form</h1>
    <base-button class="link" @click.native="navigate('/users')">Back</base-button>    
    <div class="container">
        <input-field id="reg_number" placeholder="Reg. No." v-model="reg_number" :readonly="true"/>
        <input-field id="username" placeholder="Username" v-model="username" :readonly="$route.params.id? true: false"/>
        <input-field id="password" placeholder="Password" v-model="password"/>
        <input type="checkbox" v-model="is_super_user" id="is_super_user">Super User<br>
        <hr>
        <span>Permissions</span><br>
        <div v-for="item in permission_list" :key="item.id">
        <input type="checkbox" v-model="permissions" id="permissions" :value="item.id">{{item.permission}}<br>
        </div>

        <div class="form-control">
            <success-button @click.native="save()">Save</success-button>
            <base-button class="link" @click.native="navigate('/users')">Cancel</base-button>
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
  import SelectionField from '@/components/SelectionField'
  import BaseButton from '@/components/button/BaseButton'
  import PrimaryButton from '@/components/button/PrimaryButton'
  import SuccessButton from '@/components/button/SuccessButton'
  import { ipcRenderer } from 'electron'
  
  export default {
    name: 'user-form',
    components: { InputField, SelectionField, BaseButton, PrimaryButton, SuccessButton },
    mixins: [ NavMixin ],
    data() {
      return { 
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
      save: function() {
        this.err = []
        if (! this.username) {
          this.err.push('Username is required')
        }

        if (this.$route.params.id !== undefined) {
          ipcRenderer.invoke('users/update', localStorage.getItem('userId'), {
            id: this.$route.params.id,
            username: this.username,
            password: this.password,
            is_super_user: this.is_super_user,
            permissions: this.permissions,
          }).then(result => {
            console.log('update', result)
            if (result.err) {
              this.errors = [result.err]
              return 
            }
            
            this.exit = true
            this.navigate('/users')
          })
          .catch(err => {
            console.log('Unexpected error', err.message)
          })
        } else {
          ipcRenderer.invoke('users/save', localStorage.getItem('userId'), {
            username: this.username,
            password: this.password,
            is_super_user: this.is_super_user,
            permissions: this.permissions,
          }).then(result => {
            console.log('save', result)
            if (result.err) {
              this.errors = [result.err]
              return 
            }
            
            this.exit = true
            this.navigate('/users')
          })
          .catch(err => {
            console.log('Unexpected error', err.message)
          })
        }
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
        ipcRenderer.invoke('user', {
          where: {id: this.$route.params.id}
        }).then(result => {          
          this.username = result.username
          this.permissions = result.permissions
          this.reg_number = result.reg_number
          this.is_super_user = result.is_super_user
        })
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
          });
      }
		},
  }
</script>

<style lang="scss">
 .form-control {
    display: flex;
    justify-content: space-around;
    align-content: center;

    button {

    }
 }
</style>