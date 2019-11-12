<template>
  <div>
    <h1>Login Form</h1>        
    <div class="container">
      <section class="screen" :class="username? 'shown': 'hidden'">
        <form @submit.prevent="login">
          <input-field id="username" placeholder="Username" v-model="username"/>
          <input-field id="password" placeholder="Password" type="password" v-model="password"/>
          
          <div class="form-control">
              <success-button>Login</success-button>            
          </div>

          <div class="center">
            <num-pad :max="6"  placeholder="Password" inputType="password" v-model="password" @cancel="username=password=error=''" @confirm="login"/>
          </div>

          <div class="error" v-if="error">
            <span>{{error}}</span>
          </div>
        </form>
      </section>

      <section class="container screen" :class="!username? 'shown': 'hidden'">
        <div class="center">
          <num-pad :max="6" placeholder="Reg. No." v-model="reg_number" @confirm="findUser"/>

        </div>
        <div class="error" v-if="error">
          <span>{{error}}</span>
        </div>
      </section>
    </div>
  </div>
</template>

<script>
  import EventBus from '@/components/event-bus'
  import NavMixin from '@/mixins/NavMixin'
  import InputField from '@/components/InputField'  
  import SuccessButton from '@/components/button/SuccessButton'
  import NumPad from '@/components/NumPad'
  import { ipcRenderer } from 'electron'
  import crypto from 'crypto'
  
  export default {
    name: 'login-form',
    components: { InputField, SuccessButton, NumPad },
    mixins: [ NavMixin ],
    data() {
      return {
        reg_number: '',
        username: '',
        password: '',
        error: ''
      }
    },
    methods: {      
      setError: function(error, timeout) {
        this.error = error
        setTimeout(() => {
          this.error = ''          
        }, timeout);
      },
      login: function() {
        if (! this.username) 
          return this.setError('Username is required', 5000)

        if (! this.password)
          return this.setError('Password is required', 5000)

        ipcRenderer.invoke('users/login', {
          where: {username: this.username, password: crypto.createHash('md5').update(this.password).digest("hex")}
        }).then(([user, err]) => {          
          if (!! err)
            return this.setError(err, 5000)

          localStorage.setItem('jwt', `jwt-token`)
          localStorage.setItem('userId', user.id)
          EventBus.$emit('refresh')
          this.navigate({name: 'Main'})
        }).catch(err => {
          return this.setError('Sorry, these credentials are invalid.' + err, 10000)
        })
      },      
      findUser: function(val) {
        this.reg_number = ''
        ipcRenderer.invoke('user', {
          where: {reg_number: val}
        }).then(([user, err]) => {
          if (err)
            return this.setError(err, 5000)

          this.error = ''
          this.username = user.username          
        })        
      },
    },
  }
</script>

<style lang="scss">
  .container {
    position: relative;
  }

  .form-control {
    display: flex;
    justify-content: space-around;
    align-content: center;
  }

  .error {
    display: flex;
    justify-content: space-around;
    align-content: center;
    padding-top: 1rem;
    border-bottom: 2px solid #ff4200d9;
  }

  .screen {
    transition: transform .3s ease-in-out, opacity .3s ease-in-out, display;
    transition-delay: 0s, 0s, .4s;

    &:nth-child(2) {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
    }
  }

  .center {
    display: flex;
    justify-content: space-around;
    align-content: center;
  }

  .hidden {
    transform: translate(-20%, -20%);
    opacity: 0;
    pointer-events: none;
  }

</style>