<template>
  <div>
    <h1>Login Form</h1>        
    <div class="container">
      <form v-on:submit.prevent="login">
        <input-field id="username" placeholder="Username" v-model="username"/>
        <input-field id="password" placeholder="Password" v-model="password"/>
        
        <div class="form-control">
            <success-button @click.native="login()">Login</success-button>            
        </div>

        <div class="error" v-if="error">
          <span>{{error}}</span>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
  import NavMixin from '@/mixins/NavMixin'
  import InputField from '@/components/InputField'  
  import SuccessButton from '@/components/button/SuccessButton'
  import { ipcRenderer } from 'electron'
  import crypto from 'crypto'
  
  export default {
    name: 'login-form',
    components: { InputField, SuccessButton },
    mixins: [ NavMixin ],
    data() {
      return { 
        username: '',
        password: '',
        error: ''
      }
    },
    methods: {      
      login: function() {
        if (! this.username) {
          this.error = 'Username is required'
          return
        }

        if (! this.password) {
          this.error = 'Password is required'
          return
        }

        
        ipcRenderer.invoke('user', {
          where: {username: this.username, password: crypto.createHash('md5').update(this.password).digest("hex")}
        }).then(result => {
          if (! result) {
            this.error = 'Sorry, these credentials are invalid.'
            return 
          }

          localStorage.setItem('jwt', `jwt-token`)
          this.navigate({name: 'Main'})
        }).catch(err => {
          this.error = 'Sorry, these credentials are invalid.'
        })
      },
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

  .error {
    display: flex;
    justify-content: space-around;
    align-content: center;
    padding-top: 1rem;
    border-bottom: 2px solid #ff4200d9;
  }
</style>