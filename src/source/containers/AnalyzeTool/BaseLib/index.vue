<template>
  <div class="wrap search-wrapper">
    <div class="search-scroll">
      <div class="condition">
        <div class="condition-item" :span="4">
          <span class="key">姓名：</span>
          <el-input class="name" v-model="tempCondition.name" placeholder="姓名" size="small" />
        </div>
        <div class="condition-item" :span="4">
          <span class="key">性别：</span>
          <el-select class="sex" v-model="tempCondition.sex" clearable placeholder="性别" @clear="onClearSex" size="small">
            <el-option :value="0" label="无" />
            <el-option :value="1" label="男" />
            <el-option :value="2" label="女" />
          </el-select>
        </div>
        <div class="condition-item" :span="4">
          <span class="key">证件号：</span>
          <el-input class="idcard" v-model="tempCondition.card" placeholder="证件号" size="small" />
        </div>
        <div class="condition-item" :span="4">
          <span class="key">标签：</span>
          <el-select class="label" v-model="tempCondition.labelId" clearable placeholder="标签" @clear="onClearLabel" size="small">
            <el-option v-for="{ f_Lid, f_Name } of labels" :key="f_Lid" :value="f_Lid" :label="f_Name" />
          </el-select>
        </div>
        <div class="condition-item" :span="4">
          <span class="key">年龄：</span>
          <el-input-number class="age" v-model="tempCondition.minAge" :min="0" :max="120" controls-position="right" size="small" />
          <span class="split">-</span>
          <el-input-number class="age" v-model="tempCondition.maxAge" :min="0" :max="120" controls-position="right" size="small" />
        </div>
        <div class="condition-item" :span="4">
          <el-button class="baselib-search" type="primary" @click="onSearch(1)" size='small'>查询</el-button>
          <el-button class="clear" @click="onClear" size='small'>重置</el-button>
        </div>
      </div>
      <div class="buttons">
        <el-button class="add" type="primary" icon='el-icon-plus' size='small' @click="openAddForm">添加</el-button>
        <el-button class="multi-add" type="primary" size='small' @click="openMultiAdd">批量添加</el-button>
        <el-popover class="multi-del-wrap" v-model="multiDelVisible" placement='top' @hide="closeMultiDel()">
          <el-button class="multi-del" slot="reference" size='small' @click="openMultiDel">批量删除</el-button>
          <div>
            <el-icon class="el-icon-warning base-lib-warning" />
            <span>你确定要删除选中的人像吗?</span>
          </div>
          <div class="base-lib-del-buttons">
            <el-button class="base-lib-button-mini" size="mini" @click="closeMultiDel()">取消</el-button>
            <el-button class="base-lib-button-mini" type="primary" size="mini" @click="onMultiDel">确定</el-button>
          </div>
        </el-popover>
      </div>
      <el-table class="table" :data="data" row-key='f_Id' @selection-change="onRowSelectionChange" header-cell-class-name='base-lib-cell-header' row-class-name="base-lib-row" cell-class-name='base-lib-cell-body'>
        <el-table-column type="selection" />
        <el-table-column width="100" label="序号">
          <template slot-scope="scope">{{ (condition.pageNumber - 1) * condition.pageSize + scope.$index + 1 }}</template>
        </el-table-column>
        <el-table-column class-name="base-lib-cell-face" width="150" prop="f_FaceUrl" label="图片">
          <template slot-scope="scope">
            <img class="face" :src="scope.row.f_FaceUrl" />
          </template>
        </el-table-column>
        <el-table-column prop="f_Name" label="姓名" />
        <el-table-column width="100" prop="f_Sex" label="性别">
          <template slot-scope="scope">
            <el-tag v-if="scope.row.f_Sex === 1" type="primary" size="small">男</el-tag>
            <el-tag v-else-if="scope.row.f_Sex === 2" type="danger" size="small">女</el-tag>
          </template>
        </el-table-column>
        <el-table-column width="100" label="年龄">
          <template slot-scope="scope">{{scope.row.f_Card | getAgeFromIdcard}}</template>
        </el-table-column>
        <el-table-column width="150" prop="f_NationName" label="民族" />
        <el-table-column width="200" prop="f_Card" label="证件号" />
        <el-table-column prop="f_LabelName" label="标签"></el-table-column>
        <el-table-column prop="f_Remark" label="备注" show-overflow-tooltip />
        <el-table-column width="100" label="操作">
          <template slot-scope="scope">
            <div class="operations">
              <el-button type="text" @click="openEditForm(scope.row)">编辑</el-button>
              <span class="split" />
              <el-popover v-model="delVisible[scope.$index]" placement='top' @hide="closeDel(scope.$index)">
                <div>
                  <el-icon class="el-icon-warning base-lib-warning" />
                  <span>你确定要删除该条人像吗?</span>
                </div>
                <div class="base-lib-del-buttons">
                  <el-button class="base-lib-button-mini" size="mini" @click="closeDel(scope.$index)">取消</el-button>
                  <el-button class="base-lib-button-mini" type="primary" size="mini" @click="onDel(scope.row.f_Id, scope.$index)">确定</el-button>
                </div>
                <el-button slot="reference" type="text" @click="openDel(scope.$index)">删除</el-button>
              </el-popover>
            </div>
          </template>
        </el-table-column>
      </el-table>
<!--       <div class="pagination">
        <el-pagination
          :current-page="condition.pageNumber"
          :page-size="condition.pageSize"
          :total="total"
          :page-sizes="[50, 100, 200, 500]"
          layout="total, sizes, prev, pager, next, jumper"
          @current-change="cp => onSearch(cp, condition.pageSize)"
          @size-change="ps => onSearch(condition.pageNumber, ps)"
        />
      </div>
 -->      <add-form :visible="addFormVisible" :labels="labels" @onSave="onSearch" @onClose="closeAddForm" />
      <edit-form :visible="editFormVisible" :instance="editForm" :labels="labels" @onSave="onSearch" @onClose="closeEditForm" />
      <multi-add-form :visible="multiAddVisible" @onClose="closeMultiAdd" />
    </div>
    <div class="search-coperation bottom-coperation">
      <el-pagination
          :current-page="condition.pageNumber"
          :page-size="condition.pageSize"
          :total="total"
          :page-sizes="[50, 100, 200, 500]"
          layout="total, sizes, prev, pager, next, jumper"
          @current-change="cp => onSearch(cp, condition.pageSize)"
          @size-change="ps => onSearch(condition.pageNumber, ps)"
        />
    </div>
  </div>
</template>

<script>
  import { Message } from 'element-ui'
  import AJAX from 'ajax'
  import addForm from './form.add'
  import editForm from './form.edit'
  import multiAddForm from './add.multi'

  const initialCondition = {
    name: '',
    sex: undefined,
    card: '',
    labelId: undefined,
    minAge: undefined,
    maxAge: undefined
  }

  export default {
    data () {
      return {
        mapKey: undefined,
        labels: [],
        tempCondition: {
          ...initialCondition
        },
        condition: {
          pageNumber: 1,
          pageSize: 50,
          mapKey: undefined,
          list: {
            ...initialCondition
          }
        },
        data: [],
        selects: [],
        total: 0,
        addFormVisible: false,
        editFormVisible: false,
        editForm: {},
        delVisible: {},
        multiAddVisible: false,
        multiDelVisible: false
      }
    },
    methods: {
      onClearSex () {
        this.tempCondition.sex = undefined
      },
      onClearLabel () {
        this.tempCondition.labelId = undefined
      },
      async onSearch (pageNumber = 1, pageSize = 50) {
        if(this.tempCondition.minAge > this.tempCondition.maxAge){
          Message.info("起始年龄不能大于终止年龄！");
          return false;
        }
        this.condition = { ...this.condition, pageNumber, pageSize, list: { ...this.tempCondition } }
        let { pageCount, result, mapKey } = await AJAX.post('faceGroup/getGroupUserInfoPage', {
          ...this.condition,
          list: JSON.stringify(this.condition.list)
        })
        this.data = result
        this.total = pageCount
        this.condition.mapKey = mapKey
      },
      onClear () {
        this.tempCondition = { ...initialCondition }
        this.onSearch()
      },
      onRowSelectionChange (selects) {
        this.selects = selects.map(({ f_Id }) => f_Id)
      },
      openAddForm () {
        this.addFormVisible = true
      },
      closeAddForm () {
        this.addFormVisible = false
      },
      openEditForm ({ f_Id, f_FaceUrl, f_Name, f_Sex, f_Card, f_NationId, f_LabelId, f_Remark }) {
        this.editForm = {
          fid: f_Id,
          imageData: f_FaceUrl,
          name: f_Name,
          sex: f_Sex === 0 ? undefined : f_Sex,
          card: f_Card,
          nationId: f_NationId,
          labelId: f_LabelId.split(','),
          remark: f_Remark
        }
        this.editFormVisible = true
      },
      closeEditForm () {
        this.editFormVisible = false
      },
      openDel (index) {
        this.$set(this.delVisible, index, true)
      },
      closeDel (index) {
        this.$set(this.delVisible, index, false)
      },
      async onDel (fid, index) {
        await AJAX.post('faceGroup/delSingleGroupUserInfo', { fid })
        Message.success('删除成功.')
        this.closeDel(index)
        this.onSearch(this.condition.pageNumber, this.condition.pageSize)
      },
      openMultiAdd () {
        this.multiAddVisible = true
      },
      closeMultiAdd () {
        this.multiAddVisible = false
      },
      async openMultiDel () {
        this.multiDelVisible = true
      },
      closeMultiDel (index) {
        this.multiDelVisible = false
      },
      async onMultiDel () {
        if(!this.selects.length){
          Message.info('请勾选需要删除的选项！');
          return false;
        }
        await AJAX.post('faceGroup/delManyGroupUserInfo', { idsList: JSON.stringify(this.selects) })
        Message.success('批量删除成功.')
        this.closeMultiDel()
        this.onSearch(this.condition.pageNumber, this.condition.pageSize)
      }
    },
    filters: {
      getAgeFromIdcard: function(e){
        return new Date().getFullYear() - parseInt(e.slice(6,10));
      }
    },
    components: {
      'add-form': addForm,
      'edit-form': editForm,
      'multi-add-form': multiAddForm
    },
    async created () {
      this.onSearch()
      let { result = [] } = await AJAX.post('faceLabel/getAllFaceLabel')
      this.labels = result
    }
  }
</script>

<style lang="scss">
  .base-lib-warning {
    color: #ffaa00;
  }

  .base-lib-button-mini {
    padding: 4px 9px;
  }

  .base-lib-del-buttons {
    text-align: right;
    margin-top: 16px;
  }

  .el-table th.base-lib-cell-header {
    background-color: #f3f3f3;

    .cell {
      height: 30px;
      line-height: 30px;
      color: rgba(0, 0, 0, .85);
      font-weight: bold;
    }
  }

  .el-table td.base-lib-cell-body {
    padding: 2px 0;
  }

  .base-lib-row > .base-lib-cell-face > .cell {
      height: 50px;
  }
</style>


<style lang="scss" scoped>
  .wrap {
    .condition {
      display: flex;

      .condition-item {
        display: flex;
        align-items: center;

        .name {
          width: 170px;
        }

        .sex {
          width: 120px;
        }

        .idcard {
          width: 180px;
        }

        .label-select {
          width: 189px;
        }

        .age {
          width: 100px;
        }

        .key {
          flex-shrink: 0;
          margin-right: 5px;
        }

        .split {
          flex-shrink: 0;
          margin: 0 5px;
          color: #bfbfbf;
        }

        .baselib-search, .clear {
          width: 65px;
        }

        &:not(:first-child) {
          margin-left: 20px;
        }
      }
    }

    .buttons {
      margin-top: 40px;

      .add {
        width: 82px;
      }

      .multi-del-wrap {
        margin-left: 10px;
      }

      .multi-add, .multi-del {
        width: 88px;
      }
    }

    .table {
      margin-top: 20px;

      .face {
        width: 50px;
        height: 50px;
        background: url("../../../../assets/images/default-user.png") no-repeat;
        background-size: 100% 100%;
      }

      .label {
        margin-right: 5px;
      }

      .operations {
        display: flex;
        align-items: center;

        .split {
          width: 1px;
          height: 14px;
          margin: 0 8px;
          background-color: #ddd;
        }
      }
    }

    .pagination {
      display: flex;
      justify-content: flex-end;
      margin-top: 104px;
    }
  }
</style>
