<template>
  <div class="point" :class="{ 'point-highlight': highlight }">
    <header class="header">
      <span class="car" v-html="car" @click="onClick" />
      <span class="time">{{ format(point.maxTime * 1000, 'YYYY-MM-DD HH:mm:ss') }}</span>
    </header>
    <footer class="footer">
      <div class="count">
        <span>地点数：{{ point.addrCount }}</span>
        <span>采集数：{{ point.totalCount }}</span>
        <span>区域数：{{ point.areaCount }}</span>
      </div>
      <el-button class="detail" type="text" @click="onClickDetail">查看详情>></el-button>
    </footer>
  </div>
</template>

<script>
  import { format } from 'date-fns'

  export default {
    props: {
      car: {
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
        this.$emit('onClick', this.point.target)
      },
      onClickDetail () {
        this.$emit('onClickDetail', this.point.target)
      }
    }
  }
</script>

<style lang="scss" scoped>
  .point {
    padding: 20px 30px 20px 10px;
    font-size: 14px;
    letter-spacing: -0.29px;

    .header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      transition: .3s;

      .car {
        height: 32px;
        line-height: 32px;
        padding: 0 10px;
        background-color: #1890ff;
        border-radius: 4px;
        color: #fff;
        transition: .3s;
        cursor: pointer;

        &:hover {
          background-color: #39a0ff;
        }
      }

      .time {
        padding-left: 23px;
        background: url("../../../../assets/img/time.png") left center no-repeat;
        color: #666;
      }
    }

    .footer {
      display: flex;
      justify-content: space-between;
      align-items: center;
      height: 20px;
      margin-top: 12px;

      .count {
        flex-shrink: 0;
        flex-grow: 1;
        display: flex;
        justify-content: space-between;
        color: #666;
      }

      .detail {
        flex-shrink: 0;
        padding: 0;
        margin-left: 35px;
      }
    }

    &:not(:first-child) {
      margin-top: 20px;
    }
  }

  .point-highlight {
    background-color: #e6f7ff;
  }
</style>
