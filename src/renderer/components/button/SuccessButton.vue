<template>
  <base-button class="success"><slot></slot></base-button>
</template>

<script>
import BaseButton from '@/components/button/BaseButton'

export default {
  props: ['placeholder', 'id', 'required'],
  components: { BaseButton }
}
</script>

<style lang="scss">
  
</style>