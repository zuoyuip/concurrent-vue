<template>
  <div class="bottomLeft">
    <div class="bg-color-black">
      <el-form :inline="true">
        <el-form-item label="时间范围">
          <el-date-picker
              v-model="dateTime"
              format="YYYY-MM-DD HH:mm:ss"
              type="datetimerange"
              :shortcuts="shortcuts"
              start-placeholder="起始时间"
              end-placeholder="结束时间"
          />
        </el-form-item>
        <el-form-item>
          <el-button @click="searchData">查询</el-button>
        </el-form-item>
      </el-form>
      <div class="d-flex pt-2 pl-2">

      </div>
      <div>
        <Draw :cdata="cdata" />
      </div>
    </div>
  </div>
</template>

<script>
import {defineComponent, onMounted, reactive, ref} from 'vue'
import Draw from './chart/draw'
import { ElForm, ElFormItem, ElDatePicker, ElButton } from 'element-plus'
import request from "@/utils/request"

export default defineComponent({
  components: {
    Draw, ElForm, ElFormItem, ElDatePicker, ElButton
  },
  setup() {
    const dateTime = ref('')
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
    // methods
    const setData = () => {

    }

    const searchData = () => {
      let start = dateTime.value[0];
      let end = dateTime.value[1];

      request({
        url: '/aggregation',
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
      cdata, shortcuts, dateTime, searchData
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
