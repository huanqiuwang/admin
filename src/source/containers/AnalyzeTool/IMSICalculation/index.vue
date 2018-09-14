<template>
  <collection-calculation :url="url" :columns="columns" />
</template>

<script>
  import { CollectionCalculation } from '../../../components'

  export default {
    name: 'AnalyzeToolIMSICalculation',
    data () {
      return {
        url: 'func/imsi',
        columns: [
          { prop: 'imsi', label: 'IMSI' },
          { prop: 'imei', label: 'IMEI' },
          { prop: 'tel', label: '手机号码' },
          { prop: 'belong', label: '归属地' },
          { prop: 'operator', label: '运营商' }
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
