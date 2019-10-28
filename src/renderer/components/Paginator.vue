<template>
    <ul v-if="totalPages" class="pagination">
      <li class="page-item first" >
          <base-button class="page-link" @click.native="setPage(1)" :disabled="currentPage === 1? true: false"><<</base-button>
      </li>
      <li class="page-item first" :disabled="{'true': currentPage === 1}">
          <base-button class="page-link" @click.native="setPage(--currentPage)" :disabled="currentPage === 1? true: false"><</base-button>
      </li>    
      <li v-for="n in pages" class="page-item first">
          <base-button class="page-link" @click.native="setPage(n)" :disabled="currentPage === n? true: false">{{n}}</base-button>
      </li>
      <li class="page-item first" :disabled="{'true': currentPage === 1}">
          <base-button class="page-link" @click.native="setPage(++currentPage)" :disabled="currentPage === totalPages? true: false">></base-button>
      </li>
      <li class="page-item first" >
          <base-button class="page-link" @click.native="setPage(totalPages)" :disabled="currentPage === totalPages? true: false">>></base-button>
      </li>
  </ul>
</template>

<script>
import BaseButton from '@/components/button/BaseButton'

let range = function*(start, stop, step = 1) {
  [start, stop] = !! stop ? [start, stop] : [0, start]

  for (let i = start; step > 0 ? i < stop : i > stop; i += step) 
      yield i
}

let paginate = function(page, pageSize, items) {      
      let totalPages = Math.trunc(items.length / pageSize) 

      if (!! (items.length % pageSize)) {
        totalPages++  
      }
      
      let itemsFilter = {
        offset: pageSize * (page - 1),
        limit: pageSize
      }

      let [pagesStart, pagesEnd] = [
        Math.max(Math.min(page-2, totalPages-4), 1),
        Math.min(Math.max(page+2, 5), totalPages)
      ]

      let pages = [...range(pagesStart, ++pagesEnd)]

      return {
        totalPages,
        pages,
        itemsFilter,
      }
}

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
      pages: [],
    }
  },
  methods: {
    setPage: function(page) {
      this.currentPage = page

      const {pages, totalPages, itemsFilter} = paginate(page, this.pageSize, this.items)
      this.pages = pages
      this.totalPages = totalPages

      let result = this.$listeners.getItems(itemsFilter.offset, itemsFilter.limit)
      
      this.$emit('OnPageChange', result)
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