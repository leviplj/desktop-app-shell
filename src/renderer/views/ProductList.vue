<template>
  <div>
    <h1>Product List</h1>
    <h2 @click="navigate('/')">Main</h2>
    <input type="checkbox" name="" id="" v-model="exit"> Exit
    <div class="container">
      <table>
        <thead>
          <tr>
            <th>Description</th>
            <th>Price</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(product, index) in pageOfItems">
            <td>{{product.name}}</td>
            <td>{{product.price}}</td>
            <h2 @click="navigate(`/products/edit/${product.id}`)">Edit</h2>
          </tr>
        </tbody>
      </table>
      <h2 @click="navigate('/products/add')">Add</h2>
      <br>
      <paginator @OnPageChange="pageChange" @getItems="getItems" :itemsCount="itemsCount" :pageSize="5"/>
    </div>
  </div>
</template>

<script>
  import NavMixin from '@/mixins/NavMixin'
  import Paginator from '@/components/Paginator'
  import { ipcRenderer } from 'electron'

  export default {
    name: 'product-list',
    mixins: [ NavMixin, ],
    components: { Paginator },
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
      console.log(this.itemsCount)
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

    tbody {
      td {
        
      }
    }


  }

</style>