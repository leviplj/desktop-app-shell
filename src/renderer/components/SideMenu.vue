<template>
  <nav>
    <ul>
      <li>
        <base-button class="link" @click.native="navigate('/products')"
          :disabled="is_curr_path('/products')">Products</base-button>
      </li>
    </ul>
  </nav>
</template>

<script>
  import BaseButton from '@/components/button/BaseButton'
  import NavMixin from '@/mixins/NavMixin'

  export default {
    components: { BaseButton },
    mixins: [ NavMixin, ],
    methods: {
      is_curr_path: function(path) {
        return this.$route.path === path
      }
    }
  }
</script>

<style>

</style>