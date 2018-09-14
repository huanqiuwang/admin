<template>
  <collection-calculation :url="url" :columns="columns" />
</template>

<script>
  import { CollectionCalculation } from '../../../components'

  export default {
    name: 'AnalyzeToolCarCalculation',
    data () {
      return {
        url: 'func/carplate',
        columns: [
          { prop: 'carplate', label: '车牌' }
        ]
      }
    },
    components: {
      'collection-calculation': CollectionCalculation
    }
  }
</script>

<style lang="scss" scoped>
</style>
