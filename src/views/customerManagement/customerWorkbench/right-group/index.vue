<template>
  <div class="right-group-contain">
    <div class="top-group">
      <div class="up ellipsis">{{ currentSelectSession.appNickname }}</div>
      <div class="bottom ellipsis">对应马甲：<span>{{ currentSelectSession.packerNickname }}</span></div>
    </div>
    <div class="bottom-group">

      <el-tabs v-model="currentTabID" type="card" @tab-click="onSelectTab">
        <el-tab-pane label="客户信息" name="2">
          <div class="select-group detailList" @scroll="onScrollRemark">
            <div class="title">用户基础信息</div>
            <div>
              <span>昵称：</span>
              <span>{{detailObj.nickName}}</span>
            </div>
            <div>
              <span>ID：</span>
              <span>{{detailObj.saId}}</span>
            </div>
            <div>
              <span>出生日期：</span>
              <span>{{detailObj.birthday}}</span>
            </div>
            <div>
              <span>钻石数量：</span>
              <span>{{detailObj.diamondNumber}}</span>
            </div>
            <div>
              <span>手机系统：</span>
              <span>{{detailObj.deviceSystem}}</span>
            </div>
            <div>
              <span>手机型号：</span>
              <span>{{detailObj.deviceModel}}</span>
            </div>
            <div>
              <span>App版本：</span>
              <span>{{detailObj.clientVersion}}</span>
            </div>
            <div>
              <span>App注册时间：</span>
              <span>{{detailObj.registerTime}}</span>
            </div>
            <div>
              <span>最近活跃时间：</span>
              <span>{{detailObj.lastLivelyTime}}</span>
            </div>
            <div class="title">编辑备注信息</div>
            <!-- <div>
              <span>用户标签组：</span>
              <span>{{detailObj.nickName}}</span>
            </div> -->
            <div>
              <span>来源平台：</span>
              <span>
                <editBtn v-model="detailObj.sourceType" :submit="editByUid" :list="sourceList" type="select"></editBtn>
              </span>
            </div>
            <div>
              <span>来源平台ID：</span>
              <span>
                <editBtn v-model="detailObj.sourceId" :submit="editByUid1" type="input"></editBtn>
              </span>
            </div>
            <div  v-for="item in detailObj.attributes" :key="item.attributeId" >
              <span> {{item.name}}:</span>
              <span><div>
                <el-input v-model="item.value" placeholder="未填写" size="mini" style="width: 100px;" :disabled="item.flag"></el-input>
                <span class="btn" v-show="item.flag" @click="item.flag = false">修改</span>
                <span class="btn" v-show="!item.flag"  @click="item.flag = true,item.value = item.valueOld">取消</span>
                <span class="btn" v-show="!item.flag" @click="setAttributeValue(item)">提交</span>
              </div></span>
            </div>

          </div>
        </el-tab-pane>
        <el-tab-pane label="备注信息" name="0">
          <div class="select-group" @scroll="onScrollRemark">
            <el-timeline size="large">
              <el-timeline-item v-for="(item,index) in remarkList" :key="index" :type=" item.createTime === remarkList[0].createTime ? 'primary' :''" :timestamp="item.createTime + '【' +item.sysUserName+'】'" placement="top">
                <p>{{ item.content }}</p>
              </el-timeline-item>
            </el-timeline>
            <img v-show="remarkEmpty" src="@/assets/Home/group-empty.png" width="100%" alt="">
          </div>
        </el-tab-pane>
        <el-tab-pane label="接待记录" name="1">
          <div class="select-group" @scroll="onScrollReceptionRecord">
            <el-timeline size="large">
              <el-timeline-item v-for="(item,index) in receptionRecordList" :key="index" :type="item.createTime === receptionRecordList[0].createTime ? 'primary' :''" :timestamp="item.createTime + '【'+item.sysUserName +'】'" placement="top">
                <p>{{ item.actionName +'【'+ item.csCategoryName+'】' }}</p>
              </el-timeline-item>
            </el-timeline>
            <img v-show="receptionRecordList.length === 0" src="@/assets/Home/group-empty.png" width="100%" alt="">

          </div>
        </el-tab-pane>
      </el-tabs>
      <el-input v-model="remark" clearable placeholder="请输入备注信息">
        <el-button slot="append" @click="onAddRemark">添加</el-button>
      </el-input>
      <!-- <remark-info :current-select-session="currentSelectSession" /> -->

    </div>
  </div>
</template>

<script>
import API from '@/api/customerWorkbench'
import editBtn from './components/editBtn'
import {
  editByUid,
  setAttributeValue,
  findAllSource,
} from '@/api/configManager.js'
export default {
  name: 'RightGroup',
  components: {editBtn },
  props: {
    currentSelectSession: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      currentTabID: '2',
      remark: '',
      remarkList: [],
      remarkEmpty: false,
      receptionRecordList: [],
      sourceList: [],
      detailObj: {
        attributes: [],
      },
      pageNum: 1,
      pageSize: 10,
      total: false
    }
  },
  watch: {
    'currentSelectSession.taskId': {
      handler(newV, oldV) {
        // do something, 可使用this
        this.remarkList = []
        this.receptionRecordList = []
        this.currentTabID = '2'
        this.getDetial()
      },
      deep: true,
      immediate: true
    }
  },
  created() {
    this.findAllSource()
  },
  methods: {
    setAttributeValue(item) {
      setAttributeValue({value: item.value,attributeId: item.attributeId,uid: this.currentSelectSession.appUserId}).then(res => {
        if (res.success) {
          item.flag = true;
          this.$message({
            type: 'success',
            message: '修改成功'
          });
        }else {
          this.$message({
            type: 'error',
            message: res.msg
          });
        }
      }).catch(err => {

      })
    },
    editByUid1() {
      editByUid({sourceId: this.detailObj.sourceId,uid: this.currentSelectSession.appUserId}).then(res => {
        if (res.success) {
          this.sourceIdFlag = true;
          this.getUserInfo();
          this.$message({
            type: 'success',
            message: '修改成功'
          });
        }else {
          this.$message({
            type: 'error',
            message: res.msg
          });
        }
      }).catch(err => {

      })
    },
    editByUid() {
      editByUid({sourceType: this.detailObj.sourceType,uid: this.currentSelectSession.appUserId}).then(res => {
        if (res.success) {
          // this.getUserInfo();
          this.$message({
            type: 'success',
            message: '修改成功'
          });
        }else {
          this.$message({
            type: 'error',
            message: res.msg
          });
        }
      }).catch(err => {

      })
    },
    findAllSource() {
      findAllSource({}).then(res => {
        if (res.success) {
          res.data.push({id: 0, name: '未填写'})
          this.sourceList = res.data;
        }else {
          this.$message({
            type: 'error',
            message: res.msg
          });
        }
      }).catch(err => {

      })
    },
    onSelectTab(v) {
      if (v.name === '0') {
        this.pageNum = 1
        this.remarkList = []
        this.isTotal = false
        this.getRemark()
      } else if (v.name === '1') {
        this.pageNum = 1
        this.receptionRecordList = []
        this.isTotal = false
        this.getReceptionRecord()
      }
    },
    getDetial() {
      API[this.$route.path].findUserDetailByUid({ uid: this.currentSelectSession.appUserId, }).then((res) => {
        this.detailObj = res.data;
        this.detailObj.attributes.forEach(item => {
          this.$set(item ,'flag' ,true)
          this.$set(item ,'valueOld' ,item.value)
          // item.flag = true;
          // item.valueOld = item.value;
        })
      }).catch((err) => {
        console.log(err)
      })
    },
    getReceptionRecord() {
      API[this.$route.path].receptionRecord({ uid: this.currentSelectSession.appUserId, csCategoryId: this.currentSelectSession.csCategoryId, pageNum: this.pageNum }).then((res) => {
        // this.receptionRecordList = res.data.list || []
        const list = [...res.data.list]
        if (list.length !== this.pageSize) {
          this.isTotal = true
        }
        if (this.pageNum > 0) {
          this.receptionRecordList = [ ...this.receptionRecordList,...list,]
          // setTimeout(this.toBottom, 200)
        }
      }).catch((err) => {
        console.log(err)
      })
    },
    getRemark() {
      API[this.$route.path].remarkFindByPage({ uid: this.currentSelectSession.appUserId, pageNum: this.pageNum }).then((res) => {
        // if (res.data.list.length <= res.data.total) {
        // this.remarkList.push(...res.data.list)
        const list = [...res.data.list]
        if (list.length !== this.pageSize) {
          this.isTotal = true
        }
        if (this.pageNum > 0) {
          this.remarkList = [...this.remarkList, ...list]
          this.remarkEmpty = !res.data.list.length

          // setTimeout(this.toBottom, 200)
        }
        // }

        // this.remarkList = res.data.list || []
      }).catch((err) => {
        console.log(err)
      })
    },
    onAddRemark() {
      if (this.remark.trim().length === 0) {
        return
      }
      API[this.$route.path].remarkAdd({ uid: this.currentSelectSession.appUserId, content: this.remark }).then((res) => {
        this.$message.success('操作成功')
        this.remark = ''
        this.remarkList = []
        this.getRemark()
      }).catch((err) => {
        console.log(err)
      })
    },
    onScrollRemark(v) {
      const el = v.target
      // 加1处理浏览器不是全屏的特殊情况
      if (el.scrollTop + el.clientHeight + 1  >= el.scrollHeight && !this.isTotal) {
        console.log('到底啦-onScrollRemark')
        setTimeout(() => {
          // if (this.pageNum * 10 <= this.remarkList.length) {
          this.pageNum++
          this.getRemark()
          // }
        }, 1000)
      }
    },
    onScrollReceptionRecord(v) {
      const el = v.target
      // console.log(v,6666666666)
      // console.log(el.scrollTop,'el.scrollTop')
      // console.log(el.clientHeight,'el.clientHeight')
      // console.log(el.scrollHeight,'el.scrollHeight')
      // 加1处理浏览器不是全屏的特殊情况
      if (el.scrollTop + el.clientHeight + 1 >= el.scrollHeight && !this.isTotal) {
        console.log('到底啦-onScrollReceptionRecord')
        setTimeout(() => {
          this.pageNum++
          this.getReceptionRecord()
        }, 1000)
      }
    }
  }
}
</script>

<style lang='scss' scoped>
.btn {
  margin-left: 5px;
  color: #409EFF;
  font-size: 12px;
  white-space: nowrap;
}
.detailList {
  padding: 5px;
  .title{
    font-size: 16px;
    font-weight: bold;
    margin-bottom: 10px;
  }
  &>div {
    display: flex;
    margin-bottom: 10px;
    &>span:nth-child(2) {
      color: #666;
      margin-left: 5px;
    }
  }
}

.right-group-contain{
  width: 300px;
  .top-group{
    height: 60px;
    display: flex;
    flex-direction: column;
    padding: 10px 10px;
    border-bottom: rgb(240,240,240) 1px solid;
    justify-content: space-between;
    font-size: 14px;
    // align-items: center;
    .up{
      width: 100%;
    };
    .bottom{
      width: 100%;
      // text-align: right
    };
  }
  .bottom-group{
    display: flex;
    height: calc(100vh - 142px);
    flex-direction: column;
    justify-content: space-between;
    .select-group{
      height: calc(100vh - 293px);
      flex: 1;
      overflow: auto;
    }

  }
  ::v-deep .el-timeline{
    font-size: 12px;
    padding: 20px;
  }
}
.ellipsis{
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
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
</style>