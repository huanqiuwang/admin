<template>
  <div class="wrap">
    <el-button class="button" type="text" size="small" @click="onBack">返回</el-button>
    <span>MAC：{{ point.mac }}</span>
  </div>
</template>

<script>
  export default {
    props: {
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
    text-align: center;
    height: 46px;
    line-height: 46px;
    background-color: #e6f7ff;
    color: #1890ff;
    font-size: 14px;
    letter-spacing: -0.29px;

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
