<template>
  <div class="bottomLeft">
    <div class="bg-color-black">
      <el-row>
        <el-col :span="2"></el-col>
        <el-col :span="10" justify="center">
          <el-form :inline="true">
            <el-form-item label="时间范围">
              <el-date-picker
                  v-model="dateTime"
                  format="YYYY-MM-DD HH:mm:ss"
                  type="datetimerange"
                  :shortcuts="shortcuts"
                  start-placeholder="起始时间"
                  end-placeholder="结束时间"
                  :disabled="isSearch"
              />
            </el-form-item>
            <el-form-item>
              <el-button :disabled="isSearch" @click="searchData">询价统计</el-button>
              <el-button :disabled="isSearch" @click="verifyData">验价统计</el-button>
            </el-form-item>
          </el-form>
        </el-col>
        <el-col :span="2"></el-col>
        <el-col :span="8">
          <el-form :inline="true">
            <el-form-item label="询价实时观察">
              <el-date-picker
                  v-model="syncTime"
                  format="YYYY-MM-DD HH:mm:ss"
                  type="datetime"
                  placeholder="选择起始时间"
              />
            </el-form-item>
            <el-form-item>
              <el-button :disabled="isSearch" @click="syncSearch">开始</el-button>
            </el-form-item>
            <el-form-item>
              <el-button :disabled="!isSearch" @click="closeSyncSearch">结束</el-button>
            </el-form-item>
          </el-form>
        </el-col>
      </el-row>

      <div>
        <Draw :cdata="cdata" />
      </div>
    </div>
  </div>
</template>

<script>
import {defineComponent, onMounted, reactive, ref} from 'vue'
import Draw from './chart/draw'
import { ElForm, ElFormItem, ElDatePicker, ElButton, ElCol, ElRow } from 'element-plus'
import request from "@/utils/request"

export default defineComponent({
  components: {
    Draw, ElForm, ElFormItem, ElDatePicker, ElButton, ElCol, ElRow
  },
  setup() {
    const dateTime = ref('')
    const syncTime = ref('')
    const shortcuts = [
      {
        text: '上周',
        value: () => {
          const end = new Date()
          const start = new Date()
          start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
          return [start, end]
        },
      },
      {
        text: '上个月',
        value: () => {
          const end = new Date()
          const start = new Date()
          start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
          return [start, end]
        },
      },
      {
        text: '最近三个月',
        value: () => {
          const end = new Date()
          const start = new Date()
          start.setTime(start.getTime() - 3600 * 1000 * 24 * 90)
          return [start, end]
        },
      },
    ]
    const cdata = reactive({
      dateTime: [],
      successRate: [],
      timeOutRate: [],
      failRate: [],
      validRate: [],
      count: []
    })

    // 是否在执行询价
    const isSearch = ref(false)
    let searchSetInterval = 0

    // methods
    const syncSearch = () => {
      let start = syncTime.value
      isSearch.value = true
      searchSetInterval = setInterval(() => {
        request({
          url: '/searchAggregation',
          method: 'post',
          data: {
            start: start,
            end: new Date()
          }
        }).then(value => {
          cdata.dateTime = value.dateTime
          cdata.count = value.count
          cdata.failRate = value.failRate
          cdata.successRate = value.successRate
          cdata.timeOutRate = value.timeOutRate
          cdata.validRate = value.validRate
        })
      }, 1000 * 60)
    }

    const closeSyncSearch = () => {
      clearInterval(searchSetInterval)
      isSearch.value = false
    }

    const searchData = () => {
      let start = dateTime.value[0];
      let end = dateTime.value[1];

      request({
        url: '/searchAggregation',
        method: 'post',
        data: {
          start: start,
          end: end
        }
      }).then(value => {
        cdata.dateTime = value.dateTime
        cdata.count = value.count
        cdata.failRate = value.failRate
        cdata.successRate = value.successRate
        cdata.timeOutRate = value.timeOutRate
        cdata.validRate = value.validRate
      })
    }

    const verifyData = () => {
      let start = dateTime.value[0];
      let end = dateTime.value[1];

      request({
        url: '/verifyAggregation',
        method: 'post',
        data: {
          start: start,
          end: end
        }
      }).then(value => {
        cdata.dateTime = value.dateTime
        cdata.count = value.count
        cdata.failRate = value.failRate
        cdata.successRate = value.successRate
        cdata.timeOutRate = value.timeOutRate
        cdata.validRate = value.validRate
      })
    }

    // 生命周期
    onMounted(() => {

    })

    return {
      cdata, shortcuts, dateTime, syncTime, searchData, isSearch, syncSearch, verifyData, closeSyncSearch
    }
  }
})
</script>

<style lang="scss" scoped>
$box-height: 960px;
$box-width: 100%;
.bottomLeft {
  padding: 20px 16px;
  height: $box-height;
  width: $box-width;
  border-radius: 5px;
  .bg-color-black {
    height: $box-height - 35px;
    border-radius: 10px;
    text-align: center;
  }
  .text {
    color: #c3cbde;
  }
  .chart-box {
    margin-top: 16px;
    width: 170px;
    height: 170px;
    .active-ring-name {
      padding-top: 10px;
    }
  }
}
</style>
