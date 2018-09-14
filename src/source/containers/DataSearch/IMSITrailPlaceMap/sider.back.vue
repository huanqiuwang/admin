<template>
  <div class="wrap">
    <el-button class="button" type="text" size="small" @click="onBack">返回</el-button>
    <div class="data">IMSI: {{ data }}</div>
    <el-tooltip :content="point.address" placement="top">
      <span class="address">地点：{{ point.address }}</span>
    </el-tooltip>
  </div>
</template>

<script>
  export default {
    props: {
      data: {
        type: String,
        required: true
      },
      point: {
        type: Object,
        required: true
      }
    },
    methods: {
      onBack () {
        this.$emit('onBack')
      }
    }
  }
</script>

<style lang="scss" scoped>
  .wrap {
    flex-shrink: 0;
    position: relative;
    display: flex;
    align-items: center;
    justify-content: space-between;
    height: 46px;
    padding: 0 10px 0 70px;
    background-color: #e6f7ff;
    color: #1890ff;
    font-size: 14px;
    letter-spacing: -0.29px;

    .data {
      flex-shrink: 0;
      margin-right: 20px;
    }

    .address {
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .button {
      position: absolute;
      top: 13px;
      left: 16px;
      padding: 2px 0px 2px 14px;
      background: url("../../../../assets/img/back.png") left center no-repeat;
      font-size: 14px;
    }
  }
</style>
