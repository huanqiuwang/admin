<template>
  <base-lib-form ref="form" :visible="visible" :instance="instance" title='编辑' :labels="labels" :saving="saving" @onSave="onSave" @onClose="onClose" />
</template>

<script>
  import { Message } from 'element-ui'
  import AJAX from 'ajax'
  import form from './form'

  export default {
    props: {
      visible: {
        type: Boolean,
        default: false
      },
      labels: {
        type: Array,
        default: () => []
      },
      instance: {
        type: Object,
        default: () => ({})
      }
    },
    data () {
      return {
        saving: false
      }
    },
    methods: {
      async onSave (form) {
        if (!this.saving) {
          this.saving = true
          try {
            await AJAX.post('faceGroup/updateGroupUserInfo', { list: JSON.stringify(form) })
            Message.success('编辑成功.')
            this.$emit('onSave')
            this.onClose()
          } catch (e) {
          }
          this.saving = false
        }
      },
      onClose () {
        this.saving = false
        this.$refs.form.clear()
        this.$emit('onClose')
      }
    },
    components: {
      'base-lib-form': form
    }
  }
</script>
