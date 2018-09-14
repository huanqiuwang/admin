<template>
  <base-lib-form ref="form" :visible="visible" title='添加' :labels="labels" :saving="saving" @onSave="onSave" @onClose="onClose" />
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
            await AJAX.post('faceGroup/addGroupUserInfo', { list: JSON.stringify(form) })
            Message.success('添加成功.')
            this.$emit('onSave')
            this.onClose()
            this.$refs.form.clear()
          } catch (e) {
          }
          this.saving = false
        }
      },
      onClose () {
        this.saving = false
        this.$emit('onClose')
      }
    },
    components: {
      'base-lib-form': form
    }
  }
</script>
