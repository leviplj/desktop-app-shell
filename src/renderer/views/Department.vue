<template>
  <div>
    <h1>Department Form</h1>
    <base-button class="link" @click.native="navigate('/departments')">Back</base-button>
    <input type="checkbox" name="" id="" v-model="exit"> Exit
    <div class="container">
      <input-field id="name" placeholder="Name" v-model="name"/>

      <div class="form-control">
          <success-button @click.native="save()">Save</success-button>
          <base-button class="link" @click.native="navigate('/departments')">Cancel</base-button>
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
  import PrimaryButton from '@/components/button/PrimaryButton'
  import SuccessButton from '@/components/button/SuccessButton'
  import { ipcRenderer } from 'electron'
  
  export default {
    name: 'department-form',
    components: { InputField, BaseButton, PrimaryButton, SuccessButton },
    mixins: [ NavMixin ],
    data() {
      return { 
        name: '',
        price: 0,
        exit: false, 
        errors: [],
      }
    },
    methods: {
      setId: function(id) {
        this.id = id
        
        ipcRenderer.invoke('department', {
          where: {id: this.id}
        }).then(([department, err])=> {
          if (err) {
            this.errors = [err]
            return
          }

          this.name = department.name
        })
      },
      create: function() {
        ipcRenderer.invoke('departments/save', localStorage.getItem('userId'), {
          name: this.name,
        }).then(([department, err]) => {
          if (err) 
            return this.errors = [err]

          this.exit = true
          this.navigate({path: '/departments', query: { id: department.id }})
        })
      },
      update: function() {
        ipcRenderer.invoke('departments/update', localStorage.getItem('userId'), {
          id: this.$route.params.id,
          name: this.name,
        }).then(([affectedRows, err]) => {
          if (err)
            return this.errors = [err]

          this.exit = true
          this.navigate('/departments')
        })
      },
      validate: function() {
        this.errors = []
        if (! this.name)
          this.errors.push('Name is required')

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
      canLeave: function() {
        if (this.exit) return true
        return this.name === '' &&
          (this.price === 0 || this.price === '')
      }
    },
    mounted() {
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