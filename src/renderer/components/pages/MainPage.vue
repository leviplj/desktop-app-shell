<template>
  <div>
    <h1>Main Page</h1>
    <h2 @click="navigate('/products')">Products</h2>
  </div>
</template>

<script>
  export default {
    name: 'main-page',
    components: { },
    data() {
      return { }
    },
    methods: { 
      navigate: function(route) {
        this.$router.push(route)
      }
    }
  }
</script>

<style>

</style>