<template>
  <div class="wrap search-wrapper">
    <header class="condition search-scroll">
      <div class="collection-temp">
        <!-- <span class="key">选择地点：</span>
        <device-picker class="value" v-model="collection.locations" /> -->
        <datetime-picker 
          :showDatepicker="timePickClass"
          @commitHandle="addCollection"
          @closeHandle="closeTimePicker"></datetime-picker>
       <!--  <span class="key">选择时间：</span>
        <el-date-picker class="value" size="small" v-model="collection.time" type="datetimerange" :picker-options="pickerOptions" range-separator="至" start-placeholder="开始时间" end-placeholder="结束时间" align="right" /> -->
        <!-- <i class="el-icon-circle-plus add" @click="addCollection"/> -->
        
      </div>
      <div class="collections" >
        <header>已创建数据集合：</header>
        <footer>
          <div class="collection" v-for="(collection, index) of condition.list" :key="index">
            <div class="title">{{ String.fromCharCode(65 + parseInt(index)) }} 集合</div>
            <div class="body">
              <el-tooltip :content="collection.names" placement="top-start">
                <div class="text">{{ collection.names }}</div>
              </el-tooltip>
              <i class="el-icon-close delete" @click="deleteCollection(index)"/>
            </div>
          </div>
          <el-button class="add-btn" type="primary" @click="showTimePicker">添加计算条件</el-button> 
        </footer>
      </div>
      <div class="expression">
        <header>
          <span>添加集合运算逻辑：</span>
          <el-tooltip placement="top">
            <template slot="content">
              <div :style="tipRowStyle">
                <span :style="tipColStyle">&：</span>
                <span>表示两个集合求交集</span>
              </div>
              <div :style="tipRowStyle">
                <span :style="tipColStyle">-：</span>
                <span>表示两个集合求差集</span>
              </div>
              <div :style="tipRowStyle">
                <span :style="tipColStyle">+：</span>
                <span>表示两个集合求并集</span>
              </div>
              <div :style="tipRowStyle">
                <span :style="tipColStyle">()：</span>
                <span>表示高优先级</span>
              </div>
              <div :style="tipRowStyle">
                <span :style="tipColStyle">例：</span>
                <span>A + (B & C) - D 代表 先计算集合B、C的交集，再和A集合求并集，最后算出和D集合的差集</span>
              </div>
            </template>
            <el-icon class="el-icon-question" />
          </el-tooltip>
        </header>
        <footer>
          <el-input class="input" v-model="condition.expression" placeholder="例：A + (B & C) - D" size="medium" />
          <el-button class="calculate" type="primary" size="medium" @click="calculate">开始计算</el-button>
          <el-button class="reset" size="medium" @click="resetCondition">重置</el-button>
        </footer>
      </div>

      <footer class="data">
        <el-table :data="data" :header-row-style="{ color: 'rgba(0, 0, 0, .85)' }">
          <el-table-column v-for="{ prop, label } of columns" :key="prop" :prop="prop" :label="label" />
        </el-table>
      </footer>
    </header>
    <div class="pagination search-coperation" v-if="total">
      <div class="info">共 {{ total }} 条记录 第 {{ condition.currentPage }} / {{ Math.ceil(total / condition.pageSize) }} 页</div>
      <el-pagination
        :current-page="condition.currentPage"
        :page-size="condition.pageSize"
        :total="total"
        :page-sizes="[50, 100, 200, 500]"
        layout="total, sizes, prev, pager, next, jumper"
        @current-change="onCurrentChange"
        @size-change="onSizeChange"
      />
    </div>
  </div>
</template>

<script>
  import { Message } from 'element-ui'
  import AJAX, { loading } from 'ajax'
  import DevicePicker from '../DevicePicker'
  import DatetimePicker from './DatetimePicker.vue'

  const getInitTime = () => {
    let start = new Date()
    let end = new Date()
    start.setDate(start.getDate() - 1)
    start.setHours(0)
    start.setMinutes(0)
    start.setSeconds(0)
    end.setHours(23)
    end.setMinutes(59)
    end.setSeconds(59)
    return [start, end]
  }

  export default {
    props: {
      url: {
        type: String,
        required: true
      },
      columns: {
        type: Array,
        default: () => []
      }
    },
    data () {
      return {
        timePickClass: 'hidden',
        pickerOptions: {
          shortcuts: [
            {
              text: '最近一周',
              onClick (picker) {
                const end = new Date()
                const start = new Date()
                start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
                picker.$emit('pick', [start, end])
              }
            },
            {
              text: '最近一个月',
              onClick (picker) {
                const end = new Date()
                const start = new Date()
                start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
                picker.$emit('pick', [start, end])
              }
            },
            {
              text: '最近三个月',
              onClick (picker) {
                const end = new Date()
                const start = new Date()
                start.setTime(start.getTime() - 3600 * 1000 * 24 * 90)
                picker.$emit('pick', [start, end])
              }
            }
          ]
        },
        collection: {
          locations: [],
          time: getInitTime(),
          get start () {
            return this.time ? Number.parseInt(this.time[0].getTime() / 1000) : undefined
          },
          get end () {
            return this.time ? Number.parseInt(this.time[1].getTime() / 1000) : undefined
          }
        },
        condition: {
          list: [],
          expression: '',
          currentPage: 1,
          pageSize: 50,
          sessionKey: ''
        },
        tipRowStyle: { display: 'flex' },
        tipColStyle: { width: '25px', textAlign: 'right' },
        data: [],
        total: 0
      }
    },
    methods: {
      showTimePicker: function(){
        this.timePickClass = 'active';
      },
      resetCollection () {
        this.collection.locations = []
        this.collection.time = getInitTime()
      },
      closeTimePicker: function(){
        this.timePickClass = 'hidden';
      },
      addCollection (data) {
        let { locations, time, start, end} = data;
        if (!time) {
          Message.error('请选择时间范围.')
          return
        }
        let ids = []
        let names = []
        for (let { id, label } of locations) {
          ids.push(id)
          names.push(label)
        }
        this.condition.list.push({
          addr: ids.length?ids:'[]',
          names: names.length && names.join(',') || '全部地点',
          start,
          end,
          time
        })
        this.resetCollection()
        this.condition.sessionKey = ''
      },
      deleteCollection (index) {
        this.condition.sessionKey = ''
        this.condition.list.splice(index, 1)
      },
      async loadData (currentPage = this.condition.currentPage, pageSize = this.condition.pageSize) {
        let { list, expression, sessionKey } = this.condition
        if (!sessionKey) {
          if (!list.length) {
            Message.error('请添加数据集合.')
            return
          }
          if (!expression.trim()) {
            Message.error('请添加集合运算逻辑.')
            return
          }
        }
        let { sessionKey: cacheKey, result = [], page } = await loading(AJAX.post(this.url, { ...this.condition, list: JSON.stringify(list), currentPage, pageSize }))
        this.condition.sessionKey = cacheKey
        this.data = result
        this.total = page.totalCount
      },
      calculate () {
        this.condition.currentPage = 1
        this.loadData()
      },
      async onCurrentChange (cp) {
        await this.loadData(cp)
        this.condition.currentPage = cp
      },
      async onSizeChange (ps) {
        await this.loadData(this.condition.currentPage, ps)
        this.condition.pageSize = ps
      },
      resetCondition () {
        this.resetCollection()
        this.condition = {
          list: [],
          expression: '',
          currentPage: 1,
          pageSize: this.condition.pageSize,
          sessionKey: ''
        }
        this.data = []
        this.total = 0
      }
    },
    components: {
      'device-picker': DevicePicker,
      'datetime-picker': DatetimePicker
    }
  }
</script>

<style lang="scss" scoped>
  .add-btn{
    height: 32px;
    line-height: 32px;
    padding: 0 20px;
    margin: 10px 0;
  }

  .wrap {
    .collection-temp {
      display: flex;
      align-items: center;

      .key {
        flex-shrink: 0;
        width: 70px;
        line-height: 22px;
        font-size: 14px;
        color: rgba(0, 0, 0, .85);

        &:not(:first-child) {
          margin-left: 15px;
        }
      }

      .value {
        flex-grow: 1;
        width: initial;
      }

      .add {
        flex-shrink: 0;
        margin-left: 18px;
				color: #aaa;
				font-size: 30px;
        transition: .3s;
				cursor: pointer;

				&:hover{
					color: #1890ff;
				}
      }
    }

    .collections {
      margin-top: 28px;

      header {
        line-height: 22px;
        color: rgba(0, 0, 0, .85);
        font-size: 14px;
      }

      footer {
        display: flex;
        flex-wrap: wrap;

        .collection {
          display: flex;
          margin: 10px 0;

          .title {
            width: 70px;
            text-align: center;
            height: 32px;
            line-height: 32px;
            background-color: #efefef;
            border-radius: 4px 0px 0px 4px;
            color: #666;
            font-size: 14px;
          }

          .body {
            box-sizing: border-box;
            display: flex;
            align-items: center;
            width: 200px;
            height: 32px;
            padding: 0px 11px 0px 27px;
            background: url("../../../assets/img/location-result.png") 9px center no-repeat;
            border: 1px solid rgba(0, 0, 0, .15);
            border-radius: 0px 4px 4px 0px;

            .text {
              flex-grow: 1;
              color: rgba(0, 0, 0, .65);
              font-size: 14px;
              white-space: nowrap;
              overflow: hidden;
              text-overflow: ellipsis;
            }

            .delete {
              flex-shrink: 0;
              margin-left: 8px;
				      color: #aaa;
              transition: .3s;
              cursor: pointer;

              &:hover {
                color: #f36a6a;
              }
            }
          }

          &:not(:last-child) {
            margin-right: 40px;
          }
        }
      }
    }

    .expression {
      margin-top: 37px;

      header {
        display: flex;
        align-items: center;
        color: rgba(0, 0, 0, .85);
        font-size: 14px;

        .el-icon-question {
          color: #aaa;
          font-size: 17px;
        }
      }

      footer {
        margin-top: 10px;

        .input {
          width: 380px;
        }

        .calculate {
          margin-left: 25px;
        }

        .reset {
          margin-left: 10px;
        }
      }
    }

    .data {
      margin-top: 16px;
    }
    .pagination {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-top: 72px;

      .info {
        color: #666666;
        font-size: 14px;
        padding-left: 10px;
      }
    }
  }
</style>
