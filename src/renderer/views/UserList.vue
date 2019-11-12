<template>
  <div>
    <div class="container">
      <div class="title">
        <h1>User List</h1>
        <base-button type="success" @click.native="navigate('/users/add')">Add</base-button>
      </div>
      <table>
        <thead>
          <tr>
            <th>Username</th>
            <th>Reg. No.</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in pageOfItems" :key="item.id" :class="$route.query.id == item.id? 'recent': ''">
            <td>{{item.username}}</td>
            <td>{{item.reg_number}}</td>
            <td><base-button type="success" @click.native="navigate(`/users/edit/${item.id}`)">View</base-button></td>
          </tr>
        </tbody>
      </table>
      <paginator @OnPageChange="pageChange" @getItems="getItems" :itemsCount="itemsCount" :pageSize="5"/>
    </div>
  </div>
</template>

<script>
  import NavMixin from '@/mixins/NavMixin'
  import Paginator from '@/components/Paginator'
  import BaseButton from '@/components/button/BaseButton'
  import { ipcRenderer } from 'electron'

  export default {
    name: 'user-list',
    mixins: [ NavMixin, ],
    components: { Paginator, BaseButton },
    data() {
      return {
        pageOfItems: [],
      }
    },
    methods: {
      pageChange: function(pageOfItems) {
        this.pageOfItems = pageOfItems;
      },
      getItems: function(offset, limit) {
        return ipcRenderer.invoke('users', localStorage.getItem('userId'), {offset, limit})
      }
    },
    computed: {
      itemsCount: async function() {
        return ipcRenderer.invoke('users/count', localStorage.getItem('userId'))
      }
    }
  }
</script>

<style lang="scss">
  .container {
    padding: 0 10%;
  }

  .title {
    display: flex;
    justify-content: space-between;
    align-content: center;    
  }
</style>