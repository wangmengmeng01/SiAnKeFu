<template>
  <div class="question-answer-detail">

    <!-- button部分 -->
    <el-button :type="btnType" plain :size="btnSize" @click="init"><slot /></el-button>

    <!-- dialog部分 -->
    <el-dialog title="预览" :visible.sync="visible" :close-on-click-modal="false" top="5vh" append-to-body width="425px">
      <div style="min-height:720px;max-height:720px;overflow: auto;">
        <el-row type="flex">
          <el-col class="el-avatar" style="border-radius: 50%;">问</el-col>
          <el-col style="line-height: 40px; padding-left: 25px;">{{ detail.question }}</el-col>
        </el-row>
        <el-row type="flex" style="margin-top: 10px;">
          <el-col class="el-avatar" style="border-radius: 50%;">答</el-col>
          <el-col style="line-height: 40px; padding-left: 25px;">{{ detail.answerContent }}</el-col>
        </el-row>
        <div class="content">
          <div class="media">
            <video
              v-if="detail.video && detail.video.url"
              :src="detail.video.url"
              controls="controls"
              :poster="detail.videoCover && detail.videoCover.url"
              style="width:180px;height:320px;"
            />
            <div v-else class="imgList">
              <el-image
                v-for="(item,index) in (detail.images || [])"
                :key="index"
                style="width: 45px; height: 80px"
                fit="cover"
                :src="item.url"
                :preview-src-list="[item.url]"
              />
            </div>
          </div>
        </div>
      </div>
    </el-dialog>

  </div>
</template>

<script>
import API from '@/api/question-answer-manager'
export default {
  name: 'QuestionAnswerDetail',
  props: {
    btnType: {
      type: String,
      default: 'primary'
    },
    btnSize: {
      type: String,
      default: 'mini'
    },
    answerId: String
  },
  data() {
    return {
      visible: false,
      detail: {
        images: [],
        video: {},
        videoCover: {}
      }
    }
  },
  methods: {
    init() {
      API[this.$route.path].getAnswerDetail({ answerId: this.answerId }).then((res) => {
        this.detail = Object.assign({}, res.data)
        this.visible = true
      })
    }
  }
}
</script>
<style lang="scss" scoped>
  .question-answer-detail{
    display: inline-block;
    margin: 0 15px;
  }
  .el-dialog__body {
    max-height: 100px;
    overflow: auto;
  }
  .content {
    padding: 8px 6px;
    .tit {
      padding: 10px 0;
      font-weight: 500;
    }
    .media {
      .imgList {
        width: 100%;
        overflow-x: auto;
        overflow-y: hidden;
        white-space: nowrap;
        &::-webkit-scrollbar {
          width: 5px;
          height: 8px;
        }
        &::-webkit-scrollbar-track {
          // background-color: #f0f0f0;
          -webkit-box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);

          border-radius: 10px;

          background: #ededed;
        }
        &::-webkit-scrollbar-thumb {
          // border-radius: 2px;
          // background-color: #66f;
          border-radius: 10px;
          -webkit-box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);

          background: #535353;
        }
        .el-image {
          display: inline-block;
          box-sizing: border-box;
          margin-right: 10px;
        }
      }
    }

    .flex-wrap {
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-size: 10px;
      .info {
      }
    }
  }
</style>
