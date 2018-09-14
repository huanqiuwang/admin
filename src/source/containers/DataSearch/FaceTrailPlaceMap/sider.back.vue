<template>
  <div class="wrap">
    <el-button class="button" type="text" size="small" @click="onBack">返回</el-button>
    <img class="face" :src="`data:image/jpeg;base64,${info.face}`" />
    <el-tooltip :content="point.address" placement="top">
      <span class="address">地点：{{ point.address }}</span>
    </el-tooltip>
  </div>
</template>

<script>
  export default {
    props: {
      info: {
        type: Object,
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
    height: 50px;
    padding: 0 10px 0 70px;
    background-color: #e6f7ff;
    color: #1890ff;
    font-size: 14px;
    letter-spacing: -0.29px;

    .face {
      flex-shrink: 0;
      width: 40px;
      height: 40px;
    }

    .address {
      margin-left: 20px;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .button {
      position: absolute;
      top: 15px;
      left: 16px;
      padding: 2px 0px 2px 14px;
      background: url("../../../../assets/img/back.png") left center no-repeat;
      font-size: 14px;
    }
  }
</style>
