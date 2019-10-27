<template>
    <ul v-if="totalPages" class="pagination">
      <li class="page-item first" >
          <base-button class="page-link" @click.native="setPage(1)" :disabled="currentPage === 1? true: false"><<</base-button>
      </li>
      <li class="page-item first" :disabled="{'true': currentPage === 1}">
          <base-button class="page-link" @click.native="setPage(--currentPage)" :disabled="currentPage === 1? true: false"><</base-button>
      </li>    
      <li v-for="n in totalPages" class="page-item first">
          <base-button class="page-link" @click.native="setPage(n)" :disabled="currentPage === n? true: false">{{n}}</base-button>
      </li>
      <li class="page-item first" :disabled="{'true': currentPage === 1}">
          <base-button class="page-link" @click.native="setPage(++currentPage)" :disabled="currentPage === totalPages? true: false">></base-button>
      </li>
      <li class="page-item first" >
          <base-button class="page-link" @click.native="setPage(totalPages)" :disabled="currentPage === totalPages? true: false">>></base-button>
      </li>

      <li>Pages: {{totalPages}}</li>
  </ul>
</template>

<script>
import BaseButton from '@/components/button/BaseButton'

export default {
  components: { BaseButton },
  props: {
    items: {
        type: Array,
        required: true
    },
    items: {
        type: Array,
        required: true
    },
    initialPage: {
      type: Number,
      default: 1
    },
    pageSize: {
      type: Number,
      default: 3
    },
  },
  created() {    
    if (!! this.$listeners.OnPageChange) {
      this.setPage(this.initialPage)
    }
  },
  data() {
    return {
      currentPage: 0,
      totalPages: 0,
    }
  },
  methods: {
    setPage: function(page) {
      const { items, pageSize } = this;

      this.currentPage = page
      this.totalPages = Math.trunc(items.length / pageSize) + (!! (items.length % pageSize)? 1 : 0)
      let start = pageSize * (page - 1)
      let end = start + pageSize

      let result = this.$listeners.getItems(start, end)
      
      global.items = result
      
      this.$emit('OnPageChange', global.items)
    }
  }

}
</script>

<style lang="scss">
  ul {
    li {
      display: inline;
    }
  }
</style>