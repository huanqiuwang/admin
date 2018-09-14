<template>
  <div class="wrap">
    <img class="face" :src="`data:image/jpeg;base64,${info.face}`" />
    <el-tooltip :content="`地点数: ${info.addrCount}, 采集数: ${info.faceCount}, 区域数: ${info.areaCount}`" placement="top">
      <div class="count">
        <span>地点数: {{ info.addrCount }}</span>
        <span>采集数: {{ info.faceCount }}</span>
        <span>区域数: {{ info.areaCount }}</span>
      </div>
    </el-tooltip>
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
    height: 50px;
    padding: 0 10px;
    background-color: #e6f7ff;
    color: #1890ff;
    font-size: 14px;
    letter-spacing: -0.29px;

    .face {
      flex-shrink: 0;
      width: 40px;
      height: 40px;
    }

    .count {
      margin-left: 20px;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;

      > :not(:first-child) {
        margin-left: 5px;
      }
    }
  }
</style>
