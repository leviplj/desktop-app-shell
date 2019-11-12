<template>
  <div>
    <div class="container">
      <div class="title">
        <h1>Department List</h1>
        <success-button @click.native="navigate('/departments/add')">Add</success-button>
      </div>
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in pageOfItems" :key="item.id" :class="$route.query.id == item.id? 'recent': ''">
            <td>{{item.name}}</td>
            <td><success-button @click.native="navigate(`/departments/edit/${item.id}`)">Edit</success-button></td>
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
  import SuccessButton from '@/components/button/SuccessButton'
  import { ipcRenderer } from 'electron'

  export default {
    name: 'department-list',
    mixins: [ NavMixin, ],
    components: { Paginator, SuccessButton },
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
        return ipcRenderer.invoke('departments', localStorage.getItem('userId'), {offset, limit})
      }
    },
    computed: {
      itemsCount: async function() {
        return ipcRenderer.invoke('departments/count', localStorage.getItem('userId'))
      }
    },
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