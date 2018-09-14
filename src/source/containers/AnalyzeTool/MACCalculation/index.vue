<template>
  <collection-calculation :url="url" :columns="columns" />
</template>

<script>
  import { CollectionCalculation } from '../../../components'

  export default {
    name: 'AnalyzeToolMACCalculation',
    data () {
      return {
        url: 'func/mac',
        columns: [
          { prop: 'mac', label: 'MAC' }
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
