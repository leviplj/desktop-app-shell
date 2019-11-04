<template>
  <div>
    <h1>Department Form</h1>
    <base-button class="link" @click.native="navigate('/departments')">Back</base-button>
    <input type="checkbox" name="" id="" v-model="exit"> Exit
    <div class="container">
        <input-field id="name" placeholder="Name" v-model="name" :klass="getErrors('name').length ? 'invalid' : ''"/>

        <div class="form-control">
            <success-button @click.native="save()">Save</success-button>
            <base-button class="link" @click.native="navigate('/departments')">Cancel</base-button>
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
        errors: {name:'', price:'', exit:''},
        err: [],
      }
    },
    methods: {
      getErrors: function(field) {
        return this.err.filter(x => field in x)
      },
      save: function() {
        this.err = []
        if (! this.name) {
          this.err.push({'name': 'Required'})
        }

        if (!! this.err.length) {
          return
        }

        if (this.$route.params.id !== undefined) {
          let result = ipcRenderer.sendSync('departments/update', {
            id: this.$route.params.id,
            name: this.name,
          })
          console.log('update', result)
        } else {
          let result = ipcRenderer.sendSync('departments/save', {
            name: this.name,
          })
          console.log('save', result)
        }

        this.exit = true
        this.navigate('/departments')
      },
      canLeave: function() {
        if (this.exit) return true
        return this.name === '' &&
          (this.price === 0 || this.price === '')
      }
    },
    mounted() {
        if (this.$route.params.id !== undefined) {
          ipcRenderer.invoke('departments', {
            where: {id: this.$route.params.id}
          }).then(result => {
            this.name = result[0].name
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