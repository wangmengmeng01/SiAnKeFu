<template>
  <div class="view-delete-answers">
    <div v-for="item in answers" :key="item.answerId" class="answer-item">
      <div class="question-text">
        提问： &nbsp;{{ item.question }} <el-button type="text" icon="el-icon-delete" style="margin-left: 20px;" @click="deleteAnswer(item.questionId, item.answerId)">删除</el-button>
      </div>
      <div class="answer-text">
        回答： &nbsp;{{ item.answerContent }}
      </div>
      <div v-if="Array.isArray(item.images) && item.images.length>0" class="answer-image">
        <el-image v-for="image in item.images" :key="image.url" style="width: 100px; height: 100px; margin-right: 15px;cursor: pointer;" :src="image.url" :preview-src-list="item.images.map(i=>i.url)" />
      </div>
      <div v-if="item.video && item.videoCover" class="answer-video" @click="showVideo(item.video)">
        <el-image style="width: 100px; height: 100px;" :src="item.videoCover.url" />
        <svg-icon class="icon-play" icon-class="icon-play" />
      </div>
      <el-divider />
    </div>
    <el-dialog :visible.sync="visible" top="5vh" append-to-body width="800px" @close="currentVideo = {}">
      <video :src="currentVideo.url" controls="controls" width="100%" height="320px" />
    </el-dialog>
  </div>
</template>

<script>
import API from '@/api/user-manager'
export default {
  name: 'ViewDeleteAnswers',
  props: {
    answers: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      visible: false,
      currentVideo: {}
    }
  },
  methods: {
    deleteAnswer(questionId, answerId) {
      this.$confirm(`确认要删除问答吗？`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async() => {
        try {
          API[this.$route.path].deleteAnswer({ uid: this.$route.query.uid, questionId: questionId, answerId: answerId })
          this.$emit('success')
          this.$message.success('操作成功')
        } catch (error) {
          console.log(error)
        }
      }).catch(() => {
        console.log('用户取消操作')
      })
    },
    showVideo(video) {
      this.currentVideo = video
      this.visible = true
    }
  }
}
</script>
<style lang="scss" scoped>
.view-delete-answers {
  .answer-item {
      width: 100%;
      height: auto;
      .answer-text {
        margin: 10px auto 20px;
      }
      .answer-video {
        position: relative;
        width: 100px;
        height: 100px;
        cursor: pointer;
        .icon-play {
          position: absolute;
          top: 38px;
          left: 38px;
          margin: auto;
          font-size: 24px;
        }
      }
  }
}
</style>
