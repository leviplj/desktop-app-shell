<template>
  <div>
    <div class="container">
      <div class="title">
        <h1>Product List</h1>
        <success-button @click.native="navigate('/products/add')">Add</success-button>
      </div>
      <input type="checkbox" name="" id="" v-model="exit"> Exit
      <table>
        <thead>
          <tr>
            <th>Description</th>
            <th>Price</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in pageOfItems" :key="item.id">
            <td>{{item.name}}</td>
            <td>{{item.price}}</td>
            <td><success-button @click.native="navigate(`/products/edit/${item.id}`)">Edit</success-button></td>
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
    name: 'product-list',
    mixins: [ NavMixin, ],
    components: { Paginator, SuccessButton },
    data() {
      return {
        itemsCount: 0,
        exit: true,
        pageOfItems: [],
      }
    },
    methods: {
      pageChange: function(pageOfItems) {
        this.pageOfItems = pageOfItems;
      },
      getItems: function(offset, limit) {        
        return ipcRenderer.sendSync('products', {offset, limit}).slice()
      }
    },
    created() {
      this.itemsCount = ipcRenderer.sendSync('products/count')
    },
    beforeRouteLeave (to, from, next) {
      if (this.exit) {
        next()
      } else {
        this.$dialog.confirm('Do you want to proceed?')
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
  .container {
    padding: 0 10%;
  }

  .title {
    display: flex;
    justify-content: space-between;
    align-content: center;    
  }

  table {    
    width: 100%;
    margin-bottom: 1rem;
    color: #212529;
    border-collapse: collapse;

    thead {
      th {
        text-align: left;
        vertical-align: bottom;
        border-bottom: 2px solid #dee2e6;
      }
    }

    td,
    th {
      padding: .75rem;
      vertical-align: top;
      border-top: 1px solid #dee2e6;
    }
  }

</style>