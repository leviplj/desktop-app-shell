<template>
  <div>
    <h1>Main Page</h1>
    <h2 @click="navigate('/products')">Products</h2>
  </div>
</template>

<script>
  import NavMixin from '@/mixins/NavMixin'

  export default {
    name: 'main-page',
    mixins: [ NavMixin, ],
    components: { },
    data() {
      return { }
    }
  }
</script>

<style>

</style>