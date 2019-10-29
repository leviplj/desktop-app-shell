<template>
  <div>
    <h1>Product Form</h1>
    <base-button class="link" @click.native="navigate('/products')">Back</base-button>
    <input type="checkbox" name="" id="" v-model="exit"> Exit
    <div class="container">
        <input-field id="description" placeholder="Description" v-model="description" :klass="getErrors('price').length ? 'invalid' : ''"/>
        <input-field id="price" placeholder="Price" v-model="price" :klass="getErrors('price').length ? 'invalid' : ''"/>

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
  import BaseButton from '@/components/button/BaseButton'
  import PrimaryButton from '@/components/button/PrimaryButton'
  import SuccessButton from '@/components/button/SuccessButton'
  
  export default {
    name: 'product-form',
    components: { InputField, BaseButton, PrimaryButton, SuccessButton },
    mixins: [ NavMixin ],
    data() {
      return { 
        description: '',
        price: 0,
        exit: false, 
        errors: {description:'', price:'', exit:''},
        err: [],
      }
    },
    methods: {
      getErrors: function(field) {
        return this.err.filter(x => field in x)
      },
      save: function() {
        this.err = []
        if (! this.description) {
          this.err.push({'description': 'Required'})
        }

        if (! this.price) {
          this.err.push({'price': 'Required'})
        }

        if (!! this.err.length) {
          return
        }

        if (this.$route.params.id !== undefined) {
          let product = this.products.find((x) => x.id == this.$route.params.id)
          product.description = this.description
          product.price = this.price
        } else {
          let id = this.products.length + 1
          this.products.push({id: id, description: this.description, price: this.price})
        }

        this.exit = true          
        this.navigate('/products')
      },
      canLeave: function() {
        if (this.exit) return true
        return this.description === '' &&
          (this.price === 0 || this.price === '')
      }
    },
    created() {
        if (this.$route.params.id !== undefined) {
          let product = this.products.find((x) => x.id == this.$route.params.id)
          this.description = product.description
          this.price = product.price
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