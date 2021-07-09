<template>
  <div class="preview-post-detail">

    <!-- button部分 -->
    <el-button :type="btnType" :size="btnSize" plain @click="init"><slot /></el-button>

    <!-- dialog部分 -->
    <el-dialog title="预览" :visible.sync="visible" :close-on-click-modal="false" top="3vh" append-to-body width="425px">
      <div>
        <div class="title">
          <img :src="row.avatar" style="width:40px;height: 40px;border-radius: 50%">
          <div class="info">
            <div>{{ row.nickName }}</div>
            <div>{{ row.createTime }}</div>
          </div>
        </div>
        <div class="content">
          <div class="tit">{{ row.content }}</div>
          <div class="media">
            <video
              v-if="row.video"
              :src="row.video"
              controls="controls"
              :poster="row.videoCover"
              style="width:180px;height:320px"
            />
            <div v-else class="imgList">
              <el-image
                v-for="(item,index) in (row.realImage || [])"
                :key="index"
                style="width: 45px; height: 80px"
                fit="cover"
                :src="item.url"
                :preview-src-list="Array.isArray(row.realImage)?row.realImage.map(i => i.url):[item.url]"
              />
            </div>
          </div>
          <el-scrollbar style="height: 500px; margin-top: 10px;">
            <div v-for="(comment, commentIndex) in (commentList.filter(i=>i.active===0))" :key="commentIndex">
              <div class="flex-wrap">
                <div class="title">
                  <img :src="comment.avatar" width="20" height="20" style="border-radius: 50%">
                  <div class="info">
                    <div>{{ comment.nickName }}</div>
                    <div>{{ comment.createTime }}</div>
                  </div>
                </div>
                <div class="star">
                  <span class="like-icon">
                    <svg-icon icon-class="like-icon" />
                  </span>
                  {{ comment.likeCount }}
                </div>
              </div>

              <div class="comment">{{ comment.comment }}</div>
              <div class="offLine comment" @click="putOffComment(comment.commentId)">下架此评论</div>
            </div>
          </el-scrollbar>
        </div>
      </div>
    </el-dialog>

  </div>
</template>

<script>
import API from '@/api/post-manager'
export default {
  name: 'PreviewPostDetail',
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
      default: () => {}
    }
  },
  data() {
    return {
      visible: false,
      commentList: []
    }
  },
  methods: {
    init() {
      this.getCommentList()
    },
    async getCommentList() {
      try {
        const { dynamicId } = this.row
        const { data: { list }} = await API['/post-manager/post-list'].topicCommentList({ resourceId: dynamicId })
        this.commentList = list
        this.visible = true
      } catch (err) {
        console.log(err)
        this.commentList = []
        this.visible = true
      }
    },
    // 下架评论
    putOffComment(commentId, logic = 0) {
      this.$confirm(`确定要下架该评论吗？`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async() => {
        try {
          await API['/post-manager/post-list'].putOffComment({ commentId, logic })
          this.commentList = this.getCommentList()
        } catch (error) {
          console.log(error)
        }
      }).catch(() => {
        console.log('用户取消操作')
      })
    }
  }
}
</script>
<style lang="scss" scoped>
.preview-post-detail{
  display: inline-block;
  margin: 0 15px;
}
.el-dialog__body {
  max-height: 100px;
  overflow: auto;
}
.title {
  display: flex;
  justify-content: flex-start;
  align-items: center;
  .info {
    font-weight: bold;
    padding: 5px;
    font-size: 12px;
  }
}
.content {
  padding: 8px 6px;
  ::v-deep .el-scrollbar__wrap {
    overflow-x: hidden;
  }
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
  .comment {
    font-size: 12px;
    padding: 10px 20px;
    display: block;
  }

  .offLine {
    font-size: 12px;
    color: red;
    cursor: pointer;
  }
}
</style>
