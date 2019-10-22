<template>
  <div>
    <h1>Product Form</h1>
    <form-button @click.native="navigate('/products')">Back</form-button>
    <input type="checkbox" name="" id="" v-model="exit"> Exit
    <div class="container">
        <input-field id="description" placeholder="Description" v-model="description"/>
        <input-field id="price" placeholder="Price" v-model="price"/>

        <div class="form-control">
            <form-button class="success" @click.native="save()">Save</form-button>
            <form-button class="link" @click.native="navigate('/products')">Cancel</form-button>
        </div>
    </div>
  </div>
</template>

<script>
  import InputField from '@/components/InputField'
  import FormButton from '@/components/FormButton'
  
  export default {
    name: 'product-form',
    components: { InputField, FormButton },
    data() {
      return { 
        description: '',
        price: 0,
        exit: false
      }
    },
    methods: { 
      navigate: function(route) {
        this.$router.push(route)
      },
      save: function() {
          if (this.$route.params.id !== undefined) {            
            let product = this.products.find((x) => x.id == this.$route.params.id)
            product.description = this.description
            product.price = this.price
          } else {
            let id = this.products.length + 1
            console.log(id)
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
    position: fixed;
    bottom: 0;
    right: 0;
    display: flex;
    justify-content: space-around;
    align-content: center;

    button {

    }
 }
</style>