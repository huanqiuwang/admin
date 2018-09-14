<template>
  <div class="wrap">
    <el-tooltip :content="info.data" placement="top">
      <div class="data">IMSI: {{ info.data }}</div>
    </el-tooltip>
    <div class="count">
      <span>地点数: {{ info.addressNumber }}</span>
      <span>采集数: {{ info.collectNumber }}</span>
      <span>区域数: {{ info.areaNumber }}</span>
    </div>
  </div>
</template>

<script>
  export default {
    props: {
      info: {
        type: Object,
        required: true
      }
    }
  }
</script>

<style lang="scss" scoped>
  .wrap {
    flex-shrink: 0;
    display: flex;
    align-items: center;
    justify-content: space-between;
    height: 46px;
    padding: 0 10px;
    background-color: #e6f7ff;
    color: #1890ff;
    font-size: 14px;
    letter-spacing: -0.29px;

    .data {
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .count {
      flex-shrink: 0;
      margin-left: 20px;

      > :not(:first-child) {
        margin-left: 5px;
      }
    }
  }
</style>
