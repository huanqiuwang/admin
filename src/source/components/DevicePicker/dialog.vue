<template>
  <el-dialog :visible="visible" :show-close="false" width="700px" @close="onClose" :modal="false">
    <el-input slot="title" class="input" v-model="keyword" placeholder="输入关键字进行过滤" size="mini" />
    <el-tree class="devices" ref="devices" :data="data" node-key="id" show-checkbox default-expand-all :filter-node-method="filter" />
    <div slot="footer" class="footer">
      <el-button type="primary" @click="onConfirm">确认</el-button>
      <el-button @click="onClose">取消</el-button>
    </div>
  </el-dialog>
</template>

<script>
  import AJAX from 'ajax'

  export default {
    props: {
      visible: {
        type: Boolean,
        default: false
      },
      value: {
        type: Array,
        default: () => []
      }
    },
    data () {
      return {
        keyword: '',
        data: []
      }
    },
    watch: {
      value (nv, ov) {
        if (nv !== ov) {
          let instance = this.$refs.devices
          if (instance) {
            instance.setCheckedKeys(nv.map(({ id }) => id))
          }
        }
      },
      keyword (nv, ov) {
        let keyword = nv.trim()
        if (nv !== ov.trim()) {
          this.$refs.devices.filter(keyword)
        }
      }
    },
    methods: {
      onClose () {
        this.$emit('onClose')
      },
      onConfirm () {
        let nodes = this.$refs.devices.getCheckedNodes(true),
          validNodes = [];
        nodes.map(e => {
          if(!!e.id && e.id != 'null'){
            validNodes.push(e);
          }
        })
        this.$emit('input', [...validNodes].filter(node => this.filter(this.keyword.trim(), node)))
        this.$emit('onConfirm')
      },
      format (nodes, result = []) {
        for (let { id, name: label, device = [], child = [] } of nodes) {
          let children = device.concat(child)
          if (children.length) {
            children = this.format(children)
          }
          result.push({ id, label, children: children.length && children || undefined })
        }
        return result
      },
      filter (value, data) {
        return !value || data.label.indexOf(value) !== -1
      }
    },
    async created () {
      let { result } = await AJAX('area-device')
      this.data = this.format([result])
    }
  }
</script>

<style lang="scss" scoped>
  .input {
    width: 350px;
  }

  .devices {
    height: 260px;
    overflow: auto;
  }

  .footer {
    display: flex;
    justify-content: center;
  }

  .el-dialog__wrapper{
    overflow: visible;
  }

  .el-dialog{
      width: 700px;
      position: fixed;
      top: 0;
      bottom: 0;
      right: 0;
      left: 0;
      margin: auto;
    }
</style>
