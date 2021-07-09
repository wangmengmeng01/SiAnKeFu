<template>
  <div class="center-group-contain">
    <p v-if="loading" style="font-size: 14px;position: absolute;left: 50%;color: rgb(155, 155, 155);transform: translateX(-50%);color: #9b9b9b;">加载中...</p>
    <p v-if="isTotal && pageNum>1" style="font-size: 14px;position: absolute;left: 50%;color: rgb(155, 155, 155);transform: translateX(-50%);color: #9b9b9b;">没有更多了</p>
    <el-button type="danger" size="mini" class="close" round @click="onCloseChat">关闭并结束</el-button>
    <div ref="messageGroup" class="message-group" @scroll="onScroll">
      <div v-for="(item,index) in list" :key="index" class="list-item" :class="{'is-mine': item.isMine, 'is-system': item.isSystem}">
        <div v-show="!item.isMine " class="item-row">{{ item.fromNickName }}</div>
        <div v-show="item.isMine" class="item-row">{{ item.fromNickName }}</div>

        <div class="item-row" sytle="max-width: 60%;">
          <span :class="{'bg-others': !item.isMine, 'bg-mine': item.isMine}">
            <template v-if="item.isImage">
              <el-image :style="{width: item.content.width>item.content.height?'320px':'180px'}" :src="item.content.url" :preview-src-list="[item.content.url]" />
                <i style="font-size: 12px;color: #666;">{{ itemTime(item.serverTime) }}</i>
            </template>
            <template v-else-if="item.isVideo">
              <!-- <img :src="item.content.coverUrl"> -->
              <personalShowCover :style="{width: item.content.width>item.content.height?'320px':'180px'}" :row="{videoResourceUrl: item.content.url,videoCoverResourceUrl: item.content.coverUrl, }"/>
                <i style="font-size: 12px;color: #666;">{{ itemTime(item.serverTime) }}</i>
            </template>
            <template v-else>
              {{ item.content }} <i style="font-size: 12px;color: #666;">{{ itemTime(item.serverTime) }}</i>
            </template>
          </span>
        </div>
        <div v-show="checkNeedTime(index)" class="show-timer">{{ getNextServerTime(index) }}</div>
      </div>
    </div>
    <div class="chat-group">
      <div class="top-group">
        <emojiSelect @select="val=>inputMessage += String.fromCodePoint(val)" />
        <picture-select @select="val=>sendMessage('IMAGE', val)" />
        <!-- <video-select @select="val=>sendMessage('VIDEO', val)" /> -->
      </div>
      <div class="bottom-group">
        <el-input
          v-model="inputMessage"
          class="edit-input"
          resize="none"
          rows="5"
          maxlength="200"
          type="textarea"
          @keydown.enter.native="textareaKeydown"
          @keyup.enter.native="sendMessage('TEXT')"
        />
        <el-button size="small" class="send-btn" type="primary" plain style="margin-right: 15px" :loading="isSending" @click="sendMessage('TEXT')">{{ isSending?'':'发送' }}</el-button>

      </div>
    </div>
  </div>
</template>

<script>
import emojiSelect from './emoji-select'
import API from '@/api/customerWorkbench'
import pictureSelect from './picture-select'
import videoSelect from './video-select'
import personalShowCover from './personal-show-cover.vue'
const dayjs = require('dayjs')
export default {
  name: 'CenterGroup',
  components: { emojiSelect, pictureSelect , videoSelect, personalShowCover },
  props: {
    currentSelectSession: {
      type: Object,
      default: () => {}
    },
  },

  data() {
    return {
      inputMessage: '',
      isSending: false,
      sessionTaskId: '',
      loading: false,
      pageSize: 20,
      lastId: '',
      list: [],
      isTotal: false
    }
  },
  watch: {
    'currentSelectSession.taskId': {
      handler(newV, oldV) {
        this.list = []
        this.pageNum = 1
        this.lastId = ''
        this.sessionTaskId = ''
        this.inputMessage = ''
        this.isTotal = false
        // console.log('message--------', newV)

        this.getMessageList(this.currentSelectSession)
      },
      deep: true,
      immediate: true
    },
    [`$store.getters.message`]: {
      handler(val) {
        if (val.header) {
          if (this.currentSelectSession.csCategoryId === JSON.parse(val.body.extras.biz_content).csCategoryId) {
            if (this.currentSelectSession.appUserId === val.header.fromUserId) {
              this.list.push(this.parseReceiveMessage(val))
              setTimeout(this.toBottom, 200)
            }
          }
        }
      },
      deep: true,
      immediate: true
    }
  },
  methods: {
    getNextServerTime(v) {
      if (v + 1 >= this.list.length) {
        return ''
      }
      // console.log(this.list.length, v)
      return this.list[v + 1].serverTime
    },
    itemTime(time) {
      return time.split(' ')[1].substring(0, 5)
    },
    checkNeedTime(idx) {
      const cur = this.list[idx]
      let next = null
      if (idx + 1 >= this.list.length) {
        return false
      }
      next = this.list[idx + 1]
      // console.log('next.serverTime', (new Date(next.serverTime).valueOf() - new Date(cur.serverTime).valueOf()), 1000 * 60 * 20)
      // 如果两条消息之间间隔大于两小时 则显示时间
      if ((new Date(next.serverTime).valueOf() - new Date(cur.serverTime).valueOf()) >= 1000 * 60 * 3) {
        return true
      }
      return false
    },
    getMessageList(v) {
      this.loading = true
      API[this.$route.path].messageList({ csCategoryId: v.csCategoryId || v.categoryId, appUserId: v.appUserId, pageSize: this.pageSize, lastId: this.lastId }).then((res) => {
        this.lastId = res.data.lastId
        this.loading = false

        const list = [...this.parseMessageList(res.data.messageList || []).reverse()]
        if (list.length !== this.pageSize) {
          this.isTotal = true
        }
        if (this.pageNum > 1) {
          this.list = [...list, ...this.list]
          this.toTop(list.length)
        } else {
          this.list = list
          setTimeout(this.toBottom, 200)
        }
      }).catch((err) => {
        console.log(err)
        this.loading = false
      })
    },
    // 格式化mqtt发过来的消息
    parseReceiveMessage(msg) {
      const receiveMsg = {}
      receiveMsg.messageType = msg.header.messageType
      receiveMsg.serverTime = dayjs(msg.header.serverTime).format('YYYY/MM/DD HH:mm:ss')
      receiveMsg.fromNickName = msg.header.extras.fromNickName
      receiveMsg.userId = msg.header.fromUserId
      receiveMsg.content = JSON.parse(msg.body.extras.biz_content).content
      receiveMsg.isSystem = false
      receiveMsg.isImage = msg.header.messageType === 'IMAGE'
      receiveMsg.isVideo = msg.header.messageType === 'VIDEO'
      receiveMsg.isMine = false
      if (receiveMsg.isImage) {
        receiveMsg.content = JSON.parse(msg.body.extras.biz_content)
      }
      if (receiveMsg.isVideo) {
        receiveMsg.content = JSON.parse(msg.body.extras.biz_content)
      }
      console.log(msg,6666)
      console.log(receiveMsg,88886666)
      return receiveMsg
    },
    // 格式化历史信息
    parseMessageList(list = []) {
      const newList = (list || []).map((item, index) => {
        const obj = {
          messageType: item.messageType,
          serverTime: item.serverTime,
          fromNickName: item.fromNickname,
          targetNickName: item.targetNickname,
          content: JSON.parse(item.messageBody.extras.biz_content).content,
          isSystem: false, // this.checkNeedTime(index),
          isImage: item.messageType === 'IMAGE',
          isVideo: item.messageType === 'VIDEO',
          isMine: item.fromUserId === this.currentSelectSession.packerUid

        }
        if (obj.isSystem) {
          obj.content = obj.serverTime
        }
        if (obj.isImage || obj.isVideo) {
          obj.content = JSON.parse(item.messageBody.extras.biz_content)
        }
        return obj
      })
      return newList
    },
    // 格式化发送出去后的信息
    parsePostMessage(msg) {
      const newMsg = {}
      newMsg.messageType = msg.messageType
      newMsg.serverTime = dayjs().format('YYYY/MM/DD HH:mm:ss')
      newMsg.fromNickName = msg.packerNickname
      newMsg.content = msg.messageBody.msg
      newMsg.isSystem = false
      newMsg.isImage = msg.messageType === 'IMAGE'
      newMsg.isVideo = msg.messageType === 'VIDEO'
      newMsg.isMine = !msg.isSystem
      if (newMsg.isImage || newMsg.isVideo) {
        newMsg.content = msg.messageBody
      }
      return newMsg
    },
    onCloseChat() {
      this.$confirm('确定要将此条对话标为结束状态吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async() => {
        try {
          await API[this.$route.path].closeSession({ taskId: this.currentSelectSession.taskId })
          this.$emit('close')
          this.$store.commit('app/SET_SESSIONNUMBER', true)
        } catch (error) {
          console.log(error)
        }
      }).catch(() => {
        console.log('用户取消操作')
      })
    },
    sendMessage(v, img = {}) {
      if (v === 'TEXT' && this.inputMessage.trim().length === 0) return
      var sendParams = {
        csCategoryId: this.currentSelectSession.csCategoryId,
        sessionTaskId: this.currentSelectSession.taskId,
        appUserId: this.currentSelectSession.appUserId,
        packerNickname: this.currentSelectSession.packerNickname,
        messageType: v,
        content: v === 'TEXT' ? this.inputMessage : '',
        resourceUrl: v === 'IMAGE' ? img.url : '',
        resourceWidth: v === 'IMAGE' ? img.width : '',
        resourceHeight: v === 'IMAGE' ? img.height : '',
        serverTime: new Date().getTime()
      }
      if (v === 'VIDEO') {
        sendParams = {
          csCategoryId: this.currentSelectSession.csCategoryId,
          sessionTaskId: this.currentSelectSession.taskId,
          appUserId: this.currentSelectSession.appUserId,
          packerNickname: this.currentSelectSession.packerNickname,
          messageType: v,
          content: v === 'TEXT' ? this.inputMessage : '',
          resourceUrl: v === 'VIDEO' ? img.url : '',
          resourceWidth: v === 'VIDEO' ? img.width : '',
          resourceHeight: v === 'VIDEO' ? img.height : '',
          imgSrc: v === 'VIDEO' ? img.imgSrc : '',
          serverTime: new Date().getTime()
        }
      }
      this.isSending = true
      API[this.$route.path].pushMessage({ ...sendParams }).then((res) => {
        this.currentSelectSession.sessionTaskId = res.data.sessionTaskId

        sendParams.messageBody = {
          msg: this.inputMessage,
          ...img
        }
        this.list.push(this.parsePostMessage(sendParams))
        // 处理发送的消息给会话列表对应的会话
        this.$store.commit('app/SET_SESSIONLASTMSG', sendParams)

        setTimeout(() => {
          this.toBottom()
        }, 200)
        this.isSending = false
        this.inputMessage = ''
      }).catch((err) => {
        console.log(err)
        this.isSending = false
      })
    },
    textareaKeydown() {
      const e = window.event || arguments[0]
      if (e.key === 'Enter' || e.code === 'Enter' || e.keyCode === 13) {
        e.returnValue = false
        return false
      }
    },
    toBottom() {
      this.$nextTick(() => {
        this.$refs.messageGroup.scrollTop = this.$refs.messageGroup.scrollHeight
      })
    },
    toTop(val) {
      this.$nextTick(() => {
        this.$refs.messageGroup.scrollTop = val * 50 + 100
      })
    },
    onScroll(v) {
      if (this.list.length !== 0 && v.target.scrollTop === 0 && !this.isTotal) {
        console.log('到顶部啦')
        setTimeout(() => {
          this.pageNum++
          this.getMessageList(this.currentSelectSession)
        }, 1000)
      }
    }
  }
}
</script>

<style lang='scss' scoped>
.center-group-contain{
  flex: 1;
  min-width: 600px;
  border-left: 1px solid rgb(240,240,240);
  border-right: 1px solid rgb(240,240,240);
  background: rgb(240, 240, 240);
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  .close{
    position: absolute;
    top: 5px;
    right: 9px;
    z-index: 1;
  }
  .message-group{
    flex: 1;
    overflow: auto;
    width: 100%;
    flex: auto;
    font-size: 14px;
    line-height: 20px;
    overflow: auto;
    .list-item {
      margin: 10px 20px 10px 10px;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: space-between;
      .item-row{
        width: 100%;
        display: flex;
        align-items: center;
        justify-content: flex-start;
        text-align: left;
        word-break: break-all !important;
      }
      &.is-mine {
        .item-row {
          text-align: right;
          justify-content: flex-end;
        }
      }
      &.is-system {
        .item-row {
          text-align: center;
          justify-content: center;
          color: #9b9b9b;
          span {
            display: block !important;
            padding: 0 10px !important;
            height: 20px !important;
            max-width: 70% !important;
            line-height: 20px !important;
            font-size: 14px !important;
            background: #fff !important;
          }
        }
      }
      .bg-others{
        justify-content: flex-start;
        background: #E5EFFF;
        max-width: 70%;
        padding: 5px 10px;
        border-radius: 4px;
      }
      .bg-mine{
        justify-content: flex-end;
        background: #CBE7FF;
        max-width: 70%;
        padding: 5px 10px;
        border-radius: 4px;
        word-wrap: break-word;
        word-break: normal;
      }

    }
  }
  .chat-group{
    height: 161px;
    background: white;
    .top-group{
      height: 45px;
      border-bottom: 1px solid rgb(240,240,240);
      display: flex;
      align-items: center;
      margin-left: 10px;
    }
    .bottom-group{

    .send-btn{
        position: absolute;
        bottom: 10px;
        right: 0px;
      }
    }

  }
  .conversation-group{
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    height: 100%;
    font-size: 14px;
    .name{
      font-weight: bold;
      margin-bottom: 20px;
    }
  }
  ::v-deep .el-textarea__inner{
    border-radius: 0;
  }
::-webkit-scrollbar-track-piece { //滚动条凹槽的颜色，还可以设置边框属性
    background-color:#fff;
  }
  ::-webkit-scrollbar {//滚动条的宽度
    width:5px;
    height:5px;
  }
  ::-webkit-scrollbar-thumb {//滚动条的设置
    background-color:#dddddd;
    background-clip:padding-box;
    min-height:28px;
  }
  ::-webkit-scrollbar-thumb:hover {
    background-color:#bbb;
  }
}

</style>