<template>
  <div class="detail" :class="{ 'detail-highlight': highlight }" @click="onClick">
    <div class="left">
      <div class="index">{{ index }}.</div>
      <div class="info">
        <div class="time" v-html="detail.time" />
        <div>
          <span>相似度：</span>
          <span v-html="detail.formatedScore" />
        </div>
      </div>
    </div>
    <img class="face" :src="detail.captureImgFullUrl" />
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
        this.$emit('onClick')
      }
    }
  }
</script>

<style lang="scss" scoped>
  .detail {
    flex-shrink: 0;
    display: flex;
    justify-content: space-between;
    height: 60px;
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

      .index {
        align-self: flex-start;
      }

      .info {
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        margin-left: 10px;

        .time {
          padding-left: 23px;
          background: url("../../../../assets/img/time.png") left center no-repeat;
          color: #666;
        }
      }
    }

    .face {
      width: 60px;
      height: 60px;
    }

    &:hover {
      background-color: rgba(230, 247, 255, .5);
    }
  }

  .detail-highlight {
    background-color: #e6f7ff;

    &:hover {
      background-color: #e6f7ff;
    }
  }
</style>

