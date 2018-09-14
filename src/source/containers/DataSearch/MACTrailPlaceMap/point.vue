<template>
  <div class="point" :class="{ 'point-highlight': highlight }" @click="onClick">
    <header class="header">
      <el-tooltip placement="top">
        <div slot="content" v-html="address" />
        <span class="address" v-html="address" />
      </el-tooltip>
      <div class="count">
        <span>采集数：</span>
        <span>{{ point.collectNumber }}</span>
      </div>
    </header>
    <footer class="footer">
      <div class="time">{{ format(point.lateTime * 1000, 'YYYY-MM-DD HH:mm:ss') }}</div>
      <el-button class="detail" type="text" @click="onClickDetail">查看详情>></el-button>
    </footer>
  </div>
</template>

<script>
  import { format } from 'date-fns'

  export default {
    props: {
      address: {
        type: String,
        required: true
      },
      point: {
        type: Object,
        default: () => ({})
      },
      highlight: {
        type: Boolean,
        default: false
      }
    },
    inject: ['getMap'],
    methods: {
      format,
      async onClick () {
        if (!this.highlight) {
          let map = await this.getMap()
          map.closeInfoWindow()
        }
        this.$emit('onClick')
      },
      onClickDetail () {
        this.$emit('onClickDetail')
      }
    }
  }
</script>

<style lang="scss" scoped>
  .point {
    padding: 20px 30px 20px 10px;
    font-size: 14px;
    letter-spacing: -0.29px;
    cursor: pointer;
    transition: .3s;

    .header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      transition: .3s;

      .address {
        flex-shrink: 1;
        padding-left: 23px;
        background: url("../../../../assets/img/address.png") left center no-repeat;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        color: #666;
      }

      .count {
        flex-shrink: 0;
        display: flex;
        margin-left: 10px;
        white-space: nowrap;
      }
    }

    .footer {
      display: flex;
      justify-content: space-between;
      align-items: center;
      height: 20px;
      margin-top: 12px;

      .time {
        padding-left: 23px;
        background: url("../../../../assets/img/time.png") left center no-repeat;
        color: #666;
      }

      .detail {
        flex-shrink: 0;
        padding: 0;
        margin-left: 35px;
      }
    }

    &:hover {
      background-color: rgba(230, 247, 255, .5);
    }

    &:not(:first-child) {
      margin-top: 20px;
    }
  }

  .point-highlight {
    background-color: #e6f7ff;

    &:hover {
      background-color: #e6f7ff;
    }
  }
</style>
