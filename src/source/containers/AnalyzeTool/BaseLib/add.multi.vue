<template>
  <el-dialog class="base-lib-form" :visible="visible" title="批量添加" @close="onClose">
    <div class="wrap">
      <div class="red-tip">
        <p>请检查人像信息后按照以下格式命名后打包成“.zip文件”重新上传</p>
        <img src="../../../../assets/images/baseLib.png" alt="">
        <p>案例</p>
        <img src="../../../../assets/images/baseLib1.png" alt="">
      </div>

      <div class="form">
        <span class="uploader-key">上传文件：</span>
        <el-upload ref="upload" 
          :action="`${server}/faceGroup/addManyGroupUserInfo`" 
          :auto-upload="false" 
          accept="application/zip" 
          :limit="1" 
          :on-success="onSuccess" 
          :on-error="onError">
          <el-button class="uploader" slot="trigger" type="primary" icon="el-icon-upload2" size="small">点击上传文件</el-button>
        </el-upload>
      </div>

      <div class="red-tip">
        <p>{{message}}</p>
      </div>
      <el-table :data="tipList" height="250">
        <el-table-column type="index" label="序号" width="60"></el-table-column>
        <el-table-column prop="faceImgName" label="名称"></el-table-column>
        <el-table-column prop="errorDesc" label="错误描述"></el-table-column>
      </el-table>  
      <div class="tip" />
      <div class="buttons">
        <el-button class="button" type="primary" :loading="saving" size='small' @click="onSave">添加</el-button>
        <el-button class="button" size='small' @click="onClose">取消</el-button>
      </div>
    </div>
  </el-dialog>
</template>

<script>
  import config from 'config'

  const { server } = config

  export default {
    props: {
      visible: {
        type: Boolean,
        default: false
      }
    },
    data () {
      return {
        server,
        saving: false,
        tipList: [],
        message: ''
      }
    },
    methods: {
      clear () {
        this.message = ''
        this.saving = false
        this.tipList = []
        this.$refs.upload.clearFiles();
      },
      onSave () {
        this.saving = true
        this.$refs.upload.submit()
      },
      onSuccess (a, b, c) {
        this.saving = false
        this.tipList = a.result;
        this.message = a.message;
      },
      onError (a, b, c) {
        this.saving = false
        console.log('error', a, b, c)
      },
      onClose () {
        this.clear();
        this.$emit('onClose')
      }
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
  }
</style>

<style lang="scss" scoped>
  .wrap {
    margin-left: 170px;
    .red-tip{
      p{
        color: red;
        padding: 5px 0 10px;
      }
    }
    .form {
      margin: 10px 0 0;
      display: flex;
      align-items: flex-start;

      .uploader-key {
        line-height: 32px;
      }

      .uploader {
        width: 160px;
      }
    }

    .tip {
      margin-top: 34px;
    }

    .buttons {
      margin-top: 20px;

      .button {
        width: 65px;
      }
    }
  }
</style>
