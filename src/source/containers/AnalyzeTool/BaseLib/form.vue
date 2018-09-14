<template>
  <el-dialog class="base-lib-form" :visible="visible" :title="title" @close="onClose">
    <div>
      <div :class="['base-lib-item', { 'base-lib-item-error': propsIsEmpty.imageData || faceIsValid === false }]">
        <div class="base-lib-key base-lib-key-avatar">添加人像<span class="base-lib-required">*</span>：</div>
        <div>
          <el-upload class="base-lib-upload" :action="`${server}/faceGroup/emptyInterface`" :show-file-list="false" accept="image/png,image/jpeg,image/bmp" :before-upload="onSelectAvatar">
            <div class="base-lib-avatar" v-if="form.imageData">
              <img :src="form.imageData" @click.stop />
              <div class="base-lib-avatar-clear" @click.stop="onClearAvatar" />
            </div>
            <i class="el-icon-plus base-lib-upload-icon" v-else />
          </el-upload>
          <div class="base-lib-item-message" v-if="faceIsValid === false">只支持png、jpg、bmp格式图片.</div>
          <div class="base-lib-item-message" v-else-if="propsIsEmpty.imageData">人像不能为空.</div>
        </div>
      </div>
      <div :class="['base-lib-item', { 'base-lib-item-error': propsIsEmpty.name }]">
        <div class="base-lib-key">姓名<span class="base-lib-required">*</span>：</div>
        <div>
          <el-input class="base-lib-name" maxlength="20" v-model="form.name" placeholder="请输入姓名" size="small" />
          <div class="base-lib-item-message" v-if="propsIsEmpty.name">姓名不能为空.</div>
        </div>
      </div>
      <div class="base-lib-item">
        <div class="base-lib-key">性别：</div>
        <el-select class="base-lib-sex" v-model="form.sex" clearable placeholder="请选择" @clear="onClearSex" size="small">
          <el-option :value="1" label="男" />
          <el-option :value="2" label="女" />
        </el-select>
      </div>
      <div :class="['base-lib-item', { 'base-lib-item-error': propsIsEmpty.card || idcardIsValid === false }]">
        <div class="base-lib-key">身份证号<span class="base-lib-required">*</span>：</div>
        <div>
          <el-input class="base-lib-idcard" v-model="form.card" placeholder="请输入身份证号" size="small" />
          <div class="base-lib-item-message" v-if="propsIsEmpty.card">身份证不能为空.</div>
          <div class="base-lib-item-message" v-else-if="idcardIsValid === false">{{ idcarInvalidMessage }}</div>
        </div>
      </div>
      <div :class="['base-lib-item', { 'base-lib-item-error': propsIsEmpty.nationId }]">
        <div class="base-lib-key">民族<span class="base-lib-required">*</span>：</div>
        <div>
          <el-select class="base-lib-nation" v-model="form.nationId" filterable placeholder="请选择" size="small">
            <el-option v-for="{ f_Nid, f_Name } of nations" :key="f_Nid" :value="f_Nid" :label="f_Name" />
          </el-select>
          <div class="base-lib-item-message" v-if="propsIsEmpty.nationId">必须选择民族.</div>
        </div>
      </div>
      <div :class="['base-lib-item', { 'base-lib-item-error': propsIsEmpty.labelId }]">
        <div class="base-lib-key base-lib-key-label">标签<span class="base-lib-required">*</span>：</div>
        <div>
          <div class="base-lib-labels">
            <el-checkbox :value="labels.length === form.labelId.length" @change="onToggleAllLabel">全部</el-checkbox>
            <el-checkbox-group v-model="form.labelId">
              <el-checkbox v-for="{ f_Lid, f_Name } of labels" :key="f_Lid" :label="f_Lid">{{ f_Name }}</el-checkbox>
            </el-checkbox-group>
          </div>
          <div class="base-lib-item-message" v-if="propsIsEmpty.labelId">必须选择标签.</div>
        </div>
      </div>
      <div class="base-lib-item">
        <div class="base-lib-key base-lib-key-summary">备注：</div>
        <el-input class="base-lib-summary" maxlength="50" v-model="form.remark" type="textarea" :rows="5" resize='none' />
      </div>
      <div class="base-lib-item">
        <div class="base-lib-key" />
        <el-button class="button" type="primary" :loading="saving" size='small' @click="onSave">保存</el-button>
        <el-button class="button" size='small' @click="onClose">取消</el-button>
      </div>
    </div>
  </el-dialog>
</template>

<script>
  import config from 'config'
  import AJAX from 'ajax'
  // import { MAX } from '../../../../config/global.js'

  let ajax
  const { server } = config
  const isEmpty = value => typeof value === 'string' ? !value.trim() : (value === undefined || value === null)
  const initialForm = {
    fid: undefined,
    imageData: '',
    name: '',
    sex: undefined,
    card: '',
    nationId: undefined,
    labelId: [],
    remark: ''
  }
  const initialPropsIsEmpty = {
    imageData: false,
    name: false,
    card: false,
    nationId: false,
    labelId: false
  }

  export default {
    props: {
      visible: {
        type: Boolean,
        default: false
      },
      instance: {
        type: Object,
        default: () => ({})
      },
      title: {
        type: String,
        required: true
      },
      labels: {
        type: Array,
        default: () => []
      },
      saving: {
        type: Boolean,
        default: false
      }
    },
    data () {
      return {
        server,
        nations: [],
        form: { ...initialForm },
        faceIsValid: undefined,
        idcardIsValid: undefined,
        idcarInvalidMessage: '',
        propsIsEmpty: { ...initialPropsIsEmpty }
      }
    },
    watch: {
      instance (nv) {
        this.form = { ...this.form, ...this.instance }
      },
      'form.imageData' (nv) {
        this.propsIsEmpty.imageData = isEmpty(nv)
      },
      'form.name' (nv) {
        this.propsIsEmpty.name = isEmpty(nv)
      },
      async 'form.card' (card, ov) {
        this.propsIsEmpty.card = isEmpty(card)
        card = card.trim()
        const length = card.length
        if (length === 15 || length === 18) {
          if (card !== ov.trim()) {
          let { checkCode, message } = await AJAX.post('faceGroup/checkIDCard', { card })
          this.idcardIsValid = checkCode === 200
          this.idcarInvalidMessage = message
          }
        } else {
          this.idcardIsValid = false
          this.idcarInvalidMessage = '请输入15位或18位身份证.'
        }
      },
      'form.nationId' (nv) {
        this.propsIsEmpty.nationId = isEmpty(nv)
      },
      'form.labelId' (nv) {
        this.propsIsEmpty.labelId = nv.length === 0
      }
    },
    methods: {
      clear () {
        this.form = { ...initialForm }
        this.$nextTick(() => {
          this.faceIsValid = undefined
          this.idcardIsValid = undefined
          this.idcarInvalidMessage = ''
          this.propsIsEmpty = { ...initialPropsIsEmpty }
        })
      },
      onSelectAvatar (file) {
        const fileName = file.name
        const ext = fileName.substring(fileName.lastIndexOf('.') + 1)
        if (ext === 'jpeg') {
          this.faceIsValid = false
          return
        }
        this.faceIsValid = true
        let reader = new FileReader()
        reader.onload = () => this.form.imageData = reader.result
        reader.readAsDataURL(file)
      },
      onClearAvatar () {
        this.form.imageData = ''
        this.propsIsEmpty.imageData = true
      },
      onClearSex () {
        this.form.sex = undefined
      },
      onToggleAllLabel (checked) {
        this.form.labelId = []
        if (checked) {
          this.form.labelId = this.labels.map(({ f_Lid }) => f_Lid)
        }
      },
      onSave () {
        if (isEmpty(this.form.imageData)) {
          this.propsIsEmpty.imageData = true
        }
        if (isEmpty(this.form.name)) {
          this.propsIsEmpty.name = true
        }
        if (isEmpty(this.form.card)) {
          this.propsIsEmpty.card = true
        }
        if (isEmpty(this.form.nationId)) {
          this.propsIsEmpty.nationId = true
        }
        if (!this.form.labelId.length) {
          this.propsIsEmpty.labelId = true
        }
        for (let empty of Object.values(this.propsIsEmpty)) {
          if (empty) {
            return
          }
        }
        if (this.faceIsValid !== false && this.idcardIsValid !== false) {
          let form = { ...this.form }
          const index = form.imageData.indexOf("base64,")
          form.imageData = index === -1 ? null : form.imageData.substring(index + 7)
          if (form.sex === undefined) {
            form.sex = 0
          }
          this.$emit('onSave', form)
        }
      },
      onClose () {
        this.clear();
        this.$emit('onClose')
      }
    },
    async created () {
      ajax = ajax || AJAX.post('nation/getAllNation')
      let { result = [] } = await ajax
      this.nations = result
    }
  }
</script>

<style lang="scss">
  .base-lib-form {
    .el-dialog__header {
      padding:  15px 20px;
      background-color: #efefef;

      .el-dialog__close {
        font-size: 18px;
        font-weight: bold;
      }
    }

    .base-lib-item {
      display: flex;
      align-items: center;

      &:not(:first-child) {
        margin-top: 30px;
      }

      .el-checkbox-group, .el-checkbox + .el-checkbox {
        margin-left: 19px;
      }

      .base-lib-key {
        display: flex;
        align-items: center;
        justify-content: flex-end;
        width: 200px;
        text-align: right;
        height: 32px;
        margin-right: 5px;

        .base-lib-required {
          color: #ff0000;
        }
      }

      .base-lib-key-avatar, .base-lib-key-summary {
        align-self: flex-start;
      }

      .base-lib-upload {
        width: 82px;
        height: 82px;
        background-color: #efefef;
        border: 1px dashed #cdcdcd;
      }

      .base-lib-upload-icon {
        width: 82px;
        text-align: center;
        height: 82px;
        line-height: 82px;
        font-size: 24px;
      }

      .base-lib-avatar {
        position: relative;
        width: 82px;
        height: 82px;

        img {
          width: 100%;
          height: 100%;
          cursor: default;
        }

        .base-lib-avatar-clear {
          position: absolute;
          top: 0;
          right: 0;
          width: 16px;
          height: 16px;
          background-image: url("../../../../assets/img/avatar-delete.png");
          cursor: pointer;
        }
      }

      .base-lib-name {
        width: 218px;
      }

      .base-lib-sex {
        width: 218px;
      }

      .base-lib-idcard {
        width: 218px;
      }

      .base-lib-nation {
        width: 218px;
      }

      .base-lib-key-label {
        height: 19px;
      }

      .base-lib-labels {
        display: flex;
      }

      .base-lib-summary {
        width: 435px;
      }

      .button {
        width: 65px;
      }
    }

    .base-lib-item-error {
      .base-lib-key {
        align-self: flex-start;
      }

      .base-lib-upload, .el-input__inner, .el-select__caret {
        border-color: #ff0000;
      }
    }

    .base-lib-item-message {
      margin-top: 5px;
      color: #ff0000;
    }
  }
</style>
