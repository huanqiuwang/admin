<template>
  <div>
    <el-input placeholder="请选择地点 (可选择多个地点)" :value="names" size="small" @focus="openDialog">
      <div class="icon" slot="prefix" />
    </el-input>
    <device-picker-dialog :visible="visible" v-model="devices" @onConfirm="closeDialog" @onClose="closeDialog" />
  </div>
</template>

<script>
  import DevicePickerDialog from './dialog'

  export default {
    props: {
      value: {
        type: Array,
        default: () => []
      }
    },
    data () {
      return {
        visible: false,
        devices: this.value,
        names: ''
      }
    },
    watch: {
      value (nv, ov) {
        if (nv !== ov && nv !== this.devices) {
          this.devices = this.value
        }
      },
      devices (nv, ov) {
        if (nv !== ov) {
          this.names = nv.map(({ label }) => label).join(',')
          this.$emit('input', nv)
        }
      }
    },
    methods: {
      openDialog () {
        this.visible = true
      },
      closeDialog () {
        this.visible = false
      },
      setDevices (devices) {
        this.names = devices.map(({ label }) => label).join(',')
        this.$emit('input', devices)
        this.closeDialog()
      }
    },
    components: {
      'device-picker-dialog': DevicePickerDialog
    }
  }
</script>

<style type="scss" scoped>
  .icon {
    width: 24px;
    height: 100%;
    background: url("../../../assets/img/location.png") center no-repeat;
  }
</style>
