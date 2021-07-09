<template>
  <div class="top-group-contain">
    <div class="left-group">
      <div>当前状态</div>
      <div class="select">
        <el-select v-model="dataValue.workerStatus" @change="onChangeCurrentStatus">
          <el-option
            v-for="item in currentStatusOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </div>
      <div class="network-status">
        当前网络状态：<span :style="{color:onlineStatus?'#67C23A':'#F56C6C'}">{{ onlineStatus ? '优' : '差' }}</span>
      </div>
    </div>
    <div class="right-group">
      <div>
        <div class="today-session-number">今日已完成会话数：{{ dataValue.todayFinishSessionTaskCount || 0 }}</div>
        <div class="bottom-group">
          <el-popover
            placement="bottom"
            width="250"
            trigger="click"
          >
            <p>1. 今日已完成会话数仅包含 最后一条
              消息是客服回复的并标为结束状态的
              会话数量，单用户多条消息记录多次。</p>
            <p>2.今日已完成会话人数 指的是已完成
              的会话中的用户数量。</p>
            <i slot="reference" class="el-icon-question" />

          </el-popover>
          <span>今日已完成会话人数：{{ dataValue.todayFinishSessionPersonCount || 0 }}</span>
        </div>
      </div>
      <div>
        <el-dropdown>
          <div>
            <el-avatar icon="el-icon-user-solid"></el-avatar>
            <i class="el-icon-caret-bottom" />
          </div>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item @click.native="onLogout">退出登录</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </div>
    </div>
  </div>
</template>

<script>
import API from '@/api/customerWorkbench'
import { removeToken } from '@/utils/auth'
export default {
  name: 'TopGroup',
  props: {
    onlineStatus: {
      type: Boolean,
      default: true
    },
    endNum: {
      default: 0
    }
  },
  data() {
    return {
      dataValue: { workerStatus: '', todayFinishSessionTaskCount: '', todayFinishSessionPersonCount: '' },
      currentStatusOptions: [{ label: '在线', value: '1' }, { label: '忙碌', value: '2' }, { label: '下线', value: '3' }],
      lastSelectSeatState: ''
    }
  },
  watch: {
    [`$store.getters.sessionNumber`]: {
      handler(val) {
        if (val) {
          this.getCurrentStatus()
          this.$store.commit('app/SET_SESSIONNUMBER', false)
        }
      },
      deep: true,
      immediate: true
    },
    endNum: {
      handler(val) {
        this.getCurrentStatus();
      },
    }
  },
  mounted() {
    this.getCurrentStatus()
  },
  methods: {
    getCurrentStatus() {
      API[this.$route.path].getWorkerTodayStatistics({ }).then((res) => {
        this.dataValue = res.data
        this.dataValue.workerStatus = res.data.workerStatus + ''
        this.lastSelectSeatState = this.dataValue.workerStatus
        if (this.dataValue.workerStatus === '3') {
          this.$confirm('您已长时间未操作，系统已自动将你设置为下线，是否需要重新上线？', '异常下线提醒', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(async() => {
            try {
              await API[this.$route.path].setWorkerStatus({ workerStatus: 1 })
              this.$message.success('操作成功')
              this.lastSelectSeatState = '1'
              this.dataValue.workerStatus = '1'
            } catch (error) {
              console.log(error)
            }
          }).catch(() => {
            console.log('用户取消操作')
          })
        }
      }).catch((err) => {
        console.log(err)
      })
    },
    onChangeCurrentStatus(v) {
      if (v === '3') {
        this.$confirm('设为下线后，即结束所有会话，请确认已完成所有会话任务后再选择下线。', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(async() => {
          try {
            await API[this.$route.path].setWorkerStatus({ workerStatus: parseInt(v) })
            this.$message.success('操作成功')
            this.lastSelectSeatState = v
            this.$emit('close')
          } catch (error) {
            console.log(error)
          }
        }).catch(() => {
          this.dataValue.workerStatus = this.lastSelectSeatState
          console.log('用户取消操作')
        })
      } else if (v === '2') {
        this.$confirm('设为忙碌后，将不再给你分配新的会话任务', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(async() => {
          try {
            await API[this.$route.path].setWorkerStatus({ workerStatus: parseInt(v) })
            this.$message.success('操作成功')
            this.lastSelectSeatState = v
          } catch (error) {
            console.log(error)
          }
        }).catch(() => {
          console.log('用户取消操作')
          this.dataValue.workerStatus = this.lastSelectSeatState
        })
      } else if (v === '1') {
        API[this.$route.path].setWorkerStatus({ workerStatus: parseInt(v) }).then(res => {
          this.$message.success('操作成功')
          this.lastSelectSeatState = v
        })
      }
    },
    onLogout(v) {
      this.$confirm('是否退出登录', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async() => {
        await removeToken()
        this.$router.push(`/login?redirect=${this.$route.fullPath}`)
        window.location.reload()
      }).catch(() => {
      })
    },
  }
}
</script>

<style lang='scss' scoped>
.top-group-contain{
  width: 100%;
  height: 60px;
  border-bottom: 1px solid rgb(240,240,240);
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 14px;
  .left-group{
    margin-left: 10px;
    display: flex;
    align-items: center;
    height: 100%;
    .select{
      width: 100px;
      margin: 0 10px;
    }
  }
  .right-group{
    text-align: right;
    height: 100%;
    display: flex;
    // flex-direction: column;
    // justify-content: center;
    align-items: center;
    margin-right: 10px;
    &>div:nth-child(1) {
      margin-right: 20px;
    }
    .bottom-group{
      display: flex;
      align-items: center;
      .el-icon-question{
        font-size: 20px;
        margin-right: 5px;
      }
    }

  }
}
</style>