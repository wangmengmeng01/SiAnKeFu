<template>
  <div class="task-detail">
    <el-button :type="btnType" plain :size="btnSize" @click="init"><slot /></el-button>
    <el-dialog :title="row.title" center :visible.sync="visible" :close-on-click-modal="false" width="800px" top="5vh" append-to-body @close="reset">
      <template v-if="Object.keys(detailInfo).length > 0">
        <el-form ref="form" label-position="right" label-width="100px">
          <el-form-item label="任务描述：">
            {{ detailInfo.taskResource.content }}
          </el-form-item>
          <el-form-item label="谁可以做：">
            <el-row type="flex" align="middle" style="height: 40px">
              <el-button v-for="(item, index) in detailInfo.executorUser" :key="index" size="mini" type="text" @click="$router.push({path:'/user-manager/user-detail', query:{ uid: item.uid }})">{{ item.nickName }}</el-button>
            </el-row>
          </el-form-item>
          <el-form-item label="截止时间：">
            {{ detailInfo.taskResource.expireTime }}
          </el-form-item>
          <el-form-item label="任务奖金：">
            <span>{{ detailInfo.taskResource.diamondNumber }}</span><span style="margin-left: 10px;">钻石/人</span>
          </el-form-item>
          <el-form-item label="任务状态：">
            {{ detailInfo.taskResource.statusName }}
          </el-form-item>
        </el-form>
        <el-row type="flex" justify="center" align="middle">
          <el-divider />
          <div style="width: 140px; margin: 0px 20px; text-align: center;">任务结果</div>
          <el-divider />
        </el-row>
        <div v-for="(item, index) in detailInfo.submitTaskList" :key="index">
          <div style="margin-bottom: 10px;">{{ item.submitUser.nickName }}</div>
          <el-row type="flex" align="middle">
            <el-image v-for="(image, idx) in item.imageList" :key="idx" style="width: 100px; margin-right: 10px;" :src="image.url" :preview-src-list="[image.url]" />
            <div>
              <p>{{ item.createTime }}</p>
              <p>{{ item.content }}</p>
              <template v-if="item.likeStatus === 1">
                <p>{{ item.rewardTime }}</p>
                <p>
                  <span
                    v-for="(cell, key) in detailInfo.executorUser.filter(item => { return item.executorStatus === 1 })"
                    :key="key"
                    style="color: #409EFF; margin-right: 4px;"
                    @click="$router.push({path:'/user-manager/user-detail', query:{ uid: cell.uid }})"
                  >
                    {{ cell.nickName }}
                  </span>
                  <span>{{ `喜欢并打赏了${item.rewardAmount}金币` }} </span>
                </p>
              </template>
            </div>
          </el-row>
        </div>
        <div v-if="getUnexecutedList().length > 0" style="margin-top: 10px;">
          <span
            v-for="(item, index) in getUnexecutedList()"
            :key="index"
            style="color: #409EFF; margin-right: 4px;"
            @click="$router.push({path:'/user-manager/user-detail', query:{ uid: item.uid }})"
          >
            {{ item.nickName }}
          </span>
          <span>还未提交</span>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script>
import API from '@/api/club-manager'
export default {
  name: 'TaskDetail',
  components: { },
  props: {
    btnType: {
      type: String,
      default: 'primary'
    },
    btnSize: {
      type: String,
      default: 'mini'
    },
    row: {
      type: Object,
      default: () => null
    }
  },
  data() {
    return {
      visible: false,
      detailInfo: {

      }
    }
  },
  methods: {
    init() {
      this.form = Object.assign({}, this.form, this.row)
      this.visible = true
      this.getDetailInfo()
    },
    getDetailInfo() {
      API[this.$route.path].getDetail({ taskId: this.row.taskId, clubId: this.row.clubId }).then((res) => {
        this.detailInfo = res.data
      }).catch((err) => {
        console.log(err)
      })
    },
    getUnexecutedList() {
      const list = this.detailInfo.executorUser.filter(item => {
        return item.executorStatus === 0
      })
      return list
    },
    reset() {
      this.$refs.form.resetFields()
    }
  }
}
</script>
<style lang="scss" scoped>
  .task-detail {
    display: inline-block;
    margin-right: 15px;
  }
</style>
