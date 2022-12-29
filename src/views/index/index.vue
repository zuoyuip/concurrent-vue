<template>
  <div id="index" ref="appRef">
    <div class="bg">
      <dv-loading v-if="loading"/>
      <div v-else class="host-body">
        <div class="d-flex jc-center">
          <dv-decoration-10 class="dv-dec-10" />
          <div class="d-flex jc-center">
            <dv-decoration-8 class="dv-dec-8" :color="decorationColors" />
            <div class="title">
              <span class="title-text">{{ title }}</span>
              <dv-decoration-6
                class="dv-dec-6"
                :reverse="true"
                :color="['#50e3c2', '#67a1e5']"
              />
            </div>
            <dv-decoration-8
                :color="decorationColors"
                :reverse="true"
                class="dv-dec-8"
            />
          </div>
          <dv-decoration-10 class="dv-dec-10-s"/>
        </div>

        <div>
          <el-row>
            <el-col :span="9">
              <el-form :inline="true" size="large">
                <el-form-item label="询价服务">
                  <el-button-group>
                    <el-button :disabled="isSearch" plain type="success" @click="runSearch">启动</el-button>
                    <el-button :disabled="!isSearch" plain type="danger" @click="stopSearch">停止</el-button>
                  </el-button-group>
                </el-form-item>

                <el-form-item label="验价服务">
                  <el-button-group>
                    <el-button :disabled="!isSearch || isVerify" plain type="success" @click="runVerify">启动</el-button>
                    <el-button :disabled="!isSearch || !isVerify" plain type="danger" @click="stopVerify">停止</el-button>
                  </el-button-group>
                </el-form-item>

                <el-form-item label="执行时间">
                  <span class="timer">{{ timeInfo.time }}</span>
                </el-form-item>
              </el-form>
            </el-col>
            <el-col :span="6"></el-col>
            <el-col :span="9">
              <el-form :inline="true" size="large">
                <el-form-item label="上次启动时间">
                  <span class="timer">{{ timeInfo.startTime }}</span>
                </el-form-item>

                <el-form-item label="上次停止时间">
                  <span class="timer">{{ timeInfo.endTime }}</span>
                </el-form-item>

              </el-form>
            </el-col>
          </el-row>


        </div>

        <div class="body-box">
          <bottom-left/>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import {defineComponent, onMounted, onUnmounted, reactive, ref,} from 'vue'
import {moduleInfo, title} from '@/constant/index'
import useDraw from '@/utils/useDraw'
import BottomLeft from '../bottomLeft/index.vue'
import {ElButton, ElButtonGroup, ElCol, ElForm, ElFormItem, ElMessage, ElRow} from 'element-plus'
import request from "@/utils/request"


export default defineComponent({
  components: {
    BottomLeft, ElForm, ElFormItem, ElButton, ElButtonGroup, ElRow, ElCol
  },
  setup() {
    // 是否在执行询价
    const isSearch = ref(false)
    // 是否在执行验价
    const isVerify = ref(false)

    // * 颜色
    const decorationColors = ['#568aea', '#000000']
    // * 时间内容
    const timeInfo = reactive({
      setInterval: 0,
      startTime: '',
      endTime: '',
      time: ''
    })
    // * 适配处理
    const {appRef, calcRate, windowDraw, unWindowDraw} = useDraw()
    // 生命周期
    onMounted(() => {
      handleTime()
      // todo 屏幕适应
      windowDraw()
      calcRate()
    })

    onUnmounted(() => {
      unWindowDraw()
      clearInterval(timeInfo.setInterval)
    })

    // 启动询价服务
    const runSearch = () => {
      request({
        url: '/runSearch',
        method: 'get'
      }).then(() => {
        ElMessage({
          message: '询价服务启动成功！',
          type: 'success',
        })
        isSearch.value = true
      }).catch(() => {
        ElMessage.error('询价服务启动异常，请排查系统故障！')
        isSearch.value = false
      })
    }

    // 停止询价服务
    const stopSearch = () => {
      request({
        url: '/stopSearch',
        method: 'get'
      }).then(() => {
        ElMessage({
          message: '询价服务停止成功！',
          type: 'success',
        })
        isSearch.value = false
      }).catch(() => {
        ElMessage.error('询价服务停止异常，请排查系统故障！')
        isSearch.value = true
      })
    }

    // 是否在运行询价
    const isRunSearch = () => {
      request({
        url: '/isRunSearch',
        method: 'get'
      }).then(value => {
        isSearch.value = value
      }).catch(() => {
        isSearch.value = false
      })
    }

    // 启动验价服务
    const runVerify = () => {
      request({
        url: '/runVerify',
        method: 'get'
      }).then(() => {
        ElMessage({
          message: '验价服务启动成功！',
          type: 'success',
        })
        isVerify.value = true
      }).catch(() => {
        ElMessage.error('验价服务启动异常，请排查系统故障！')
        isVerify.value = false
      })
    }

    // 停止验价服务
    const stopVerify = () => {
      request({
        url: '/stopVerify',
        method: 'get'
      }).then(() => {
        ElMessage({
          message: '验价服务停止成功！',
          type: 'success',
        })
        isVerify.value = false
      }).catch(() => {
        ElMessage.error('验价服务停止异常，请排查系统故障！')
        isVerify.value = true
      })
    }

    // 是否在运行验价
    const isRunVerify = () => {
      request({
        url: '/isRunVerify',
        method: 'get'
      }).then(value => {
        isVerify.value = value
      }).catch(() => {
        isVerify.value = false
      })
    }

    // 获取时间监视数据
    const getWatcher = () => {
      return request({
        url: '/getWatcher',
        method: 'get'
      })
    }

    // todo 处理时间监听
    const handleTime = () => {
      timeInfo.setInterval = setInterval(() => {
        isRunSearch()
        isRunVerify()
        getWatcher().then(value => {
          timeInfo.startTime = value.startTime
          timeInfo.endTime = value.endTime
          timeInfo.time = value.time
        })
      }, 1000)
    }

    // return
    return {
      decorationColors,
      timeInfo,
      appRef,
      title,
      moduleInfo,
      runSearch,
      stopSearch,
      runVerify,
      stopVerify,
      isSearch,
      isVerify
    }
  }
})
</script>

<style lang="scss" scoped>
@import '@/assets/scss/index.scss';

.timer {
  font-size: 22px;
  color: #409EFF;
}
</style>
