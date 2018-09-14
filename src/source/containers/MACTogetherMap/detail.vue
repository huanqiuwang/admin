<template>
  <div class="detail" :class="{ 'detail-highlight': highlight }" @click="onClick">
    <div>{{ index }}.</div>
    <div class="time" v-html="detail.time" />
    <el-tooltip placement="top">
      <div slot="content" v-html="detail.address" />
      <div class="address" v-html="detail.address" />
    </el-tooltip>
  </div>
</template>

<script>
  export default {
    props: {
      index: {
        type: Number,
        required: true
      },
      detail: {
        type: Object,
        default: () => ({})
      },
      highlight: {
        type: Boolean,
        default: false
      }
    },
    methods: {
      onClick () {
        this.$emit('onClick', this.detail)
      }
    }
  }
</script>

<style lang="scss" scoped>
  .detail {
    display: flex;
    align-items: center;
    height: 50px;
    padding: 0 15px;
    border-bottom: 1px solid #e8e8e8;
    white-space: nowrap;
    color: #4a4a4a;
    font-size: 14px;
    letter-spacing: -0.29px;
    cursor: pointer;
    transition: .3s;

    .time {
      flex-shrink: 0;
      margin-left: 2px;
    }

    .address {
      padding-left: 22px;
      margin-left: 20px;
      background: url("../../../assets/img/address.png") left center no-repeat;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    &:hover {
      background-color: rgba(230, 247, 255, .5);
    }
  }

  .detail-highlight {
    background-color: #e6f7ff;
  }
</style>

