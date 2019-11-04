<template>
  <div>
    <h1>Product Form</h1>
    <base-button class="link" @click.native="navigate('/products')">Back</base-button>
    <input type="checkbox" name="" id="" v-model="exit"> Exit
    <div class="container">
        <input-field id="name" placeholder="Name" v-model="name" :klass="getErrors('name').length ? 'invalid' : ''"/>
        <input-field id="price" placeholder="Price" v-model="price" :klass="getErrors('price').length ? 'invalid' : ''"/>
        <selection-field id="department" placeholder="Department" v-model="departmentId" :options="getDepartments()" :klass="getErrors('department').length ? 'invalid' : ''"/>

        <div class="form-control">
            <success-button @click.native="save()">Save</success-button>
            <base-button class="link" @click.native="navigate('/products')">Cancel</base-button>
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
    name: 'product-form',
    components: { InputField, SelectionField, BaseButton, PrimaryButton, SuccessButton },
    mixins: [ NavMixin ],
    data() {
      return { 
        name: '',
        price: 0,
        departmentId: 0,
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

        if (! this.price) {
          this.err.push({'price': 'Required'})
        }

        if (!! this.err.length) {
          return
        }

        if (this.$route.params.id !== undefined) {
          let result = ipcRenderer.sendSync('products/update', {
            id: this.$route.params.id,
            name: this.name,
            price: this.price,
            departmentId: this.departmentId,
          })
          console.log('update', result)
        } else {
          let result = ipcRenderer.sendSync('products/save', {
            name: this.name,
            price: this.price
          })
          console.log('save', result)
        }

        this.exit = true
        this.navigate('/products')
      },
      getDepartments: function() {
        return [
          {id:1, name: `dep1`},
          {id:2, name: `dep2`}
        ]
      },
      canLeave: function() {
        if (this.exit) return true
        return this.name === '' &&
          (this.price === 0 || this.price === '')
      }
    },
    mounted() {
        if (this.$route.params.id !== undefined) {
          ipcRenderer.invoke('products', {
            where: {id: this.$route.params.id}
          }).then(result => {
            this.name = result[0].name
            this.price = result[0].price
            this.departmentId = result[0].departmentId
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