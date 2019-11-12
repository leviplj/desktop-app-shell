<template>
  <nav>
    <ul>
      <li v-for="item in items" :key="item.path" v-if="item.visible">
        <base-button class="link" @click.native="navigate(item.path)"
          :disabled="is_curr_path(item.path)">{{ item.text }}</base-button>
      </li>
      <li>
        <base-button class="link" @click.native="logout()">Logout</base-button>
      </li>
    </ul>
  </nav>
</template>

<script>
  import EventBus from '@/components/event-bus'
  import BaseButton from '@/components/button/BaseButton'
  import NavMixin from '@/mixins/NavMixin'  
  import { ipcRenderer } from 'electron'

  export default {
    components: { BaseButton },
    mixins: [ NavMixin, ],
    data() {
      return {
        items: [{
          path: '/',
          text: 'Main',
          permission: 'user_read',
          visible: false,
        },{
          path: '/products',
          text: 'Products',
          permission: 'product_read',
          visible: false,
        },{
          path: '/departments',
          text: 'Departments',
          permission: 'department_read',
          visible: false,
        },{
          path: '/users',
          text: 'Users',
          permission: 'user_read',
          visible: false,
        },]
      }
    },
    methods: {
      is_curr_path: function(path) {
        return this.$route.path === path
      },
      logout: function() {
        localStorage.removeItem('jwt', null)
        this.navigate('/login')
      }
    },
    mounted() {
      EventBus.$on('refresh', () => {        
        this.items.forEach(item => {
          ipcRenderer.invoke('permissions/check', localStorage.getItem('userId'), item.permission).then(([res, err]) => {
            item.visible = res
          })
        })
      })

      EventBus.$emit('refresh')
    }
  }
</script>

<style>

</style>