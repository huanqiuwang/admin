<template>
  <div class="sider" v-loading="loading" element-loading-custom-class="map-sider-loading" element-loading-background="rgba(0, 0, 0, 0.8)">
    <header>
      <el-input class="input" :value="value" @input="onInput" clearable size="small" @keyup.native.enter="onSearch" @clear="onClear" />
      <el-button class="button" type="primary" size="small" @click="onSearch">搜索</el-button>
    </header>
    <footer>
      <div class="header">
        <slot name="footer-header"></slot>
      </div>
      <div class="footer">
        <slot></slot>
      </div>
    </footer>
  </div>
</template>

<script>
  export default {
    props: {
      value: {
        type: String,
        default: ''
      },
      loading: {
        type: Boolean,
        default: false
      }
    },
    methods: {
      onInput (value) {
        this.$emit('input', value)
      },
      onSearch () {
        this.$emit('onSearch')
      },
      onClear () {
        this.$emit('onClear')
      }
    }
  }
</script>

<style lang="scss">
  .map-sider-loading {
    .el-loading-spinner {
      right: 80px;
    }
  }
</style>

<style lang="scss" scoped>
  .sider {
    position: relative;
    display: flex;
    flex-direction: column;

    header {
      flex-shrink: 0;
      display: flex;
      box-sizing: border-box;
      width: 430px;
      padding: 20px 20px 20px 10px;
      background-color: #fff;
      border: 1px solid #e8e8e8;
      border-radius:2px;

      .input {
        width: 310px;
      }

      .button {
        flex-grow: 1;
        margin-left: 10px;
      }
    }

    footer {
      flex-grow: 1;
      display: flex;
      flex-direction: column;
      box-sizing: border-box;
      width: 430px;
      background-color: #fff;
      border: 1px solid #e8e8e8;
      border-top: none;
      color: #444;
      font-size: 14px;

      .header {
        flex-shrink: 0;
      }

      .footer {
        flex-grow: 1;
        padding: 15px 0;
        overflow: auto;
      }
    }
  }
</style>
