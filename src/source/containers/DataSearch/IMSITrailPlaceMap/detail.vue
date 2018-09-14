<template>
  <div class="detail" :class="{ 'detail-highlight': highlight }" @click="onClick">
    <div class="index">{{ index }}.</div>
    <div class="time" v-html="detail.time" />
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
    padding: 15px;
    border-bottom: 1px solid #e8e8e8;
    white-space: nowrap;
    color: #4a4a4a;
    font-size: 14px;
    letter-spacing: -0.29px;
    cursor: pointer;
    transition: .3s;

    .time {
      padding-left: 23px;
      margin-left: 10px;
      background: url("../../../../assets/img/time.png") left center no-repeat;
      color: #666;
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

