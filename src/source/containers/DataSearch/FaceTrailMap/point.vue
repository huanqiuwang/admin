<template>
  <div class="point" :class="{ 'point-highlight': highlight }" @click="onClick">
    <div class="left">
      <div class="index">{{ index }}.</div>
      <div class="info">
        <div>
          <span>采集时间：</span>
          <span v-html="time" />
        </div>
        <el-tooltip placement="top">
          <div slot="content" v-html="address" />
          <div class="address-wrap">
            <span>采集地点：</span>
            <span class="address" v-html="address" />
          </div>
        </el-tooltip>
        <div>
          <span>相似度：</span>
          <span>{{ score }}</span>
        </div>
      </div>
    </div>
    <img class="face" :src="face" @click.stop />
  </div>
</template>

<script>
  export default {
    props: {
      index: {
        type: Number,
        required: true
      },
      time: {
        type: String,
        required: true
      },
      address: {
        type: String,
        default: ''
      },
      score: {
        type: String,
        default: ''
      },
      face: {
        type: String,
        default: ''
      },
      highlight: {
        type: Boolean,
        default: false
      }
    },
    inject: ['getMap'],
    methods: {
      async onClick (index) {
        let map = await this.getMap()
        if (!this.highlight) {
          map.closeInfoWindow()
        }
        this.$emit('onClick')
      }
    }
  }
</script>

<style lang="scss" scoped>
  .point {
    display: flex;
    justify-content: space-between;
    height: 90px;
    padding: 15px;
    border-bottom: 1px solid #e8e8e8;
    white-space: nowrap;
    color: #4a4a4a;
    font-size: 14px;
    letter-spacing: -0.29px;
    cursor: pointer;
    transition: .3s;

    .left {
      display: flex;
      height: 90px;

      .index {
        align-self: flex-start;
      }

      .info {
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        margin-left: 10px;

        .address-wrap {
          display: flex;

          .address {
            padding-left: 22px;
            max-width: 170px;
            background: url("../../../../assets/img/address.png") left center no-repeat;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
          }
        }
      }
    }

    .face {
      width: 90px;
      height: 90px;
      background-color: #ff0000;
    }

    &:hover {
      background-color: rgba(230, 247, 255, .5);
    }
  }

  .point-highlight {
    background-color: #e6f7ff;
    &:hover {
      background-color: #e6f7ff;
    }
  }
</style>
