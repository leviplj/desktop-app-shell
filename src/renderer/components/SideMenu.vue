<template>
  <nav>
    <ul>
      <li>
        <base-button class="link" @click.native="navigate('/')"
          :disabled="is_curr_path('/')">Main</base-button>
      </li>
      <li>
        <base-button class="link" @click.native="navigate('/products')"
          :disabled="is_curr_path('/products')">Products</base-button>
      </li>
      <li>
        <base-button class="link" @click.native="navigate('/departments')"
          :disabled="is_curr_path('/departments')">Department</base-button>
      </li>
      <li>
        <base-button class="link" @click.native="logout()">Logout</base-button>
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
      },
      logout: function() {
        localStorage.removeItem('jwt', null)
        this.navigate('/login')
      }
    }
  }
</script>

<style>

</style>