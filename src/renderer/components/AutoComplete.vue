<template>
  <div class="autocomplete-list">
    <div class="autocomplete-item" :class="index==active? 'active': ''" v-for="(item, index) in items" :key="item.id">
      <span class="autocomplete-query">
        <span class="autocomplete-matched">{{item.match}}</span>{{item.tail}}
      </span>
      <span class="autocomplete-extra-text">
        {{item.extra}}
      </span>
    </div>
  </div>  
</template>

<script>
import EventBus from '@/components/event-bus'

function getTotalOffset(el, rel) {
  if (!! el.offsetParent) {
    return el[rel] + getTotalOffset(el.offsetParent, rel)
  } else {
    return el[rel]
  }
}

export default {
  props: {
    el: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      itemList: Array(10).fill(1).map((x,y) => x + y).map(x => { return {id: x, name: `Department ${x}`} }),
      items: [],
      active: -1
    }
  },
  methods: {
    show: function() {
    },
    hide: function() {
      this.items = []
    },
    select: function() {
      this.$emit('select', this.items[this.active].id)
      this.hide()
    },
    navigate: function(key) {
      if (key === 'ArrowUp') {
        return this.active > 0 ? this.active--: this.active
      } else {
        return this.active < this.items.length-1 ? this.active++: this.active
      }
    },
    keyupAction: function(event) {
      if (!! ['ArrowUp', 'ArrowDown'].find((x) => x == event.key))
        return this.navigate(event.key)

      if (event.keyCode === 13) 
        return this.select()

      if (! this.target.value)
        return this.items = []

      return this.search(this.target.value)
    },
    search: function(value) {
      this.active = -1
      this.items = this.itemList
        .filter(x => x.name.indexOf(value) === 0)
        .map(x => {
          return {
            id: x.id,
            match: value,
            tail: x.name.replace(value, ''),
          }
        })
    }
  },
  computed: {
    target: function() {
      return document.getElementById(this.el)
    },
  },
  mounted() {
    let self = this
    this.target.addEventListener('focusin', () => {
      self.show()
    })
    this.target.addEventListener('focusout', () => {
      setTimeout(() => {
        self.hide()
      }, 150)
    })

    this.target.addEventListener('keyup', this.keyupAction)
  }
}
</script>

<style lang="scss">
  .autocomplete-list {
    background-color: #fff;
    position: absolute!important;
    z-index: 1000;
    border-radius: 2px;
    border-top: 1px solid #d9d9d9;
    font-family: Arial,sans-serif;
    box-shadow: 0 2px 6px rgba(0,0,0,0.3);
    -moz-box-sizing: border-box;
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
    overflow: hidden;

    .autocomplete-item {
      cursor: default;
      padding: 0 4px;
      text-overflow: ellipsis;
      overflow: hidden;
      white-space: nowrap;
      line-height: 30px;
      text-align: left;
      border-top: 1px solid #e6e6e6;
      font-size: 11px;
      color: #999;

      &:hover {
        background-color: #d6d6d6;
      }

      &.active {
        background-color: #ebf2fe
      }

      .autocomplete-query {
        font-size: 13px;
        padding-right: 3px;
        color: #000;

        .autocomplete-matched {
          font-weight: 700;
        }
      }
    }
  }

.phone-item.active {
  background-color: #ebf2fe
}
</style>