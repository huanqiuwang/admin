<template>
  <div class="wrap">
    <div class="button" @click="onSort">时间顺序</div>
  </div>
</template>

<script>
  export default {
    methods: {
      onSort () {
        this.$emit('onSort')
      }
    }
  }
</script>

<style lang="scss" scoped>
  .wrap {
    flex-shrink: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    height: 30px;
    border-bottom: 1px solid #e8e8e8;

    .button {
      padding-right: 20px;
      color: #1890ff;
      background: url("../../../assets/img/sorter.png") right center no-repeat;
      transition: .3s;
      cursor: pointer;
      user-select: none;

      &:hover {
        color: rgba(24, 144, 255, .7);
        text-decoration: underline;
      }
    }
  }
</style>
