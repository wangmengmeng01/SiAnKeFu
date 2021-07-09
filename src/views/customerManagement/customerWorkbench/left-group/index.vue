<template>
  <div class="left-group-contain">
    <el-input v-model.trim="keyWord" clearable maxlength="20" placeholder="请输入用户昵称或来源平台ID" @input="onInputSearch">
      <el-button slot="append" icon="el-icon-search" @click="onSearch" />
    </el-input>
    <template v-if="!isSearch">
      <el-tabs v-model="selectTab" type="card" tab-position="left" @tab-click="onSelectTab">
        <el-tab-pane v-for="(item,index) in tabList" :key="index" :name="item.csCategoryId">
          <div slot="label" class="list-title">
            <div>{{ item.csCategoryName }}</div>
            <div v-show="item.unReadNum" class="red-group" />
          </div>
          <div class="list-group">
            <div v-for="(listItem,i) in list" :key="i" :class=" currentItem.taskId === listItem.taskId ? 'list-item-group-press' : 'list-item-group' " @click="onClickItem(listItem)">
              <div class="list-item">
                <div class="left ellipsis">{{ listItem.appNickname }}</div>
                <div class="right">{{ $tool.getFormatDate(listItem.serverTime, 'MM:mm') }}</div>
              </div>
              <div class="list-item">
                <div class="left-bottom ellipsis">{{ listItem.text }}</div>
                <div v-if="listItem.unReadNum" class="right-unread"> {{ listItem.unReadNum }} </div>
              </div>
            </div>
            <img v-if="isEmptyList" src="@/assets/Home/group-empty.png" width="100%" alt="">

          </div>
        </el-tab-pane>
      </el-tabs>
      <el-popover
        placement="top"
        :title="'未联系客户列表('+total+')'"
        width="250"
        @click.native="pageNum = 1,getNewUserPool()"
        trigger="click"
      >
        <div class="not-contacted-user-group" infinite-scroll-disabled="scrollFlag" v-infinite-scroll="getNewUserPool" infinite-scroll-distance="10px" @scroll="onScroll">
          <div v-for="(item,index) in newUserList" :key="index" class="item " style="margin:10px 0px">{{ item.nickName }}</div>
        </div>
        <div slot="reference" class="not-contacted-box">
          <el-button class="not-contacted-user " type="primary">未联系客户({{ total }})</el-button>
        </div>
      </el-popover>
    </template>
    <template v-else>
      <div class="search-list-group">
        <div v-for="(item,index) in searchList" :key="index" class="list-item" @click="onClickSearchItem(item)">
          <div class="left-group">
            <div class="name">用户昵称：{{ item.nickName }}</div>
            <div class="mobile">来源平台ID：{{ item.userSource }}</div>
          </div>
          <div class="right-group">
            <div>{{ item.categoryName }}</div>
          </div>
        </div>
      </div>
    </template>

  </div>
</template>

<script>
import API from '@/api/customerWorkbench'

export default {
  name: 'LeftGroup',
  props: {
    currentSelectSession: {
      type: Object,
      default: () => {}
    },
    endList: {
      type: Array,
      default: () => {
        return [];
      }
    }
  },
  data() {
    return {
      keyWord: '',
      currentItem: '',
      selectTab: '',
      isSearch: false,
      scrollFlag: false,
      list: [],
      tabList: [],
      newUserList: [],
      cacheItem: {},
      searchList: [],
      pageNum: 1,
      total: 0,
      isEmptyList: false,
      lastFlag: false,

    }
  },
  watch: {
    [`$store.getters.message`]: {
      handler(val) {
        if (!val.body) return
        let obj = JSON.parse(val.body.extras.biz_content)
        if (obj.mode === 'timeout') {
          if (this.cacheItem.taskId == obj.sessionTaskId) {
            this.$emit('select', null)
          }
          this.list.forEach((item,i) => {
            if (item.taskId == obj.sessionTaskId) {
              this.list.splice(i,1)
            }
          })
          return ;
        }
        this.setCategoriesUnRead(val)
        this.setCurrentCategories(val)
      },
      deep: true,
      immediate: true
    },
    [`$store.getters.sessionLastMsg`]: {
      handler(val) {
        if (!val) return
        this.setSessionLastMsg(val)
      },
      deep: true,
      immediate: true
    },
    currentSelectSession: {
      handler(newV, oldV) {
        if (!newV) {
          this.getSessionList(this.selectTab)
        }
      },
      deep: true,
    }
  },
  mounted() {
    this.getCategories()
    this.getNewUserPool()
  },
  methods: {
    setSessionLastMsg(val) {
      let allUnreadNum = false
      this.list.forEach(item => {
        if (item.taskId === val.sessionTaskId) {
          item.text = val.content
          item.serverTime = val.serverTime
          item.unReadNum = 0
        }
        if (item.unReadNum === 0) {
          allUnreadNum = true
        }
      })
      if (allUnreadNum) {
        this.tabList.forEach(item => {
          if (item.csCategoryId === this.selectTab) {
            item.unReadNum = 0
          }
        })
      }
    },
    setCategoriesUnRead(val) {
      // console.log(val)
      if (val.header.messageType === 'ASSIGN_SESSION_TASK' || val.header.messageType === 'TEXT') {
        this.tabList.forEach((item) => {
          if (item.csCategoryId === JSON.parse(val.body.extras.biz_content).csCategoryId) {
            item.unReadNum++
          }
        })
      }
    },
    setCurrentCategories(val) {
      let isInclude = false
      this.list.forEach(item => {
        // console.log(item.appUserId, val.header.fromUserId)
        if (item.csCategoryId === JSON.parse(val.body.extras.biz_content).csCategoryId) {
          if (item.appUserId === val.header.fromUserId) {
            isInclude = true
            item.unReadNum = Number(item.unReadNum) + 1
            item.text = JSON.parse(val.body.extras.biz_content).sessionTitle
            // console.log('val.header.serverTime', this.$tool.getFormatDate(val.header.serverTime, 'MM:mm'))
            item.serverTime = val.header.serverTime// this.$tool.getFormatDate(val.header.serverTime, 'MM:mm')
          }
        }
      })
      if (!isInclude) {
        setTimeout(() => {
          this.getSessionList(this.selectTab)
        }, 100)
      }
    },
    getNewUserPool() {
      this.scrollFlag = true;
      if (this.lastFlag) {
        return
      }
      API[this.$route.path].findNewUserPoolv2({pageSize: 50,pageNum: this.pageNum,}).then((res) => {
        if (this.pageNum == 1) {
          this.pageNum++
          this.newUserList = res.data.list || []
          this.total = res.data.total;
          this.scrollFlag = false;
          return
        }
        this.pageNum++
        this.total = res.data.total;
        if (res.data.list.length < 50) {
          this.lastFlag = true;
          this.newUserList = res.data.list.concat(this.newUserList) || []
        }else {
          this.newUserList = res.data.list.concat(this.newUserList) || []
        }
        this.scrollFlag = false;
      }).catch((err) => {
        console.log(err)
      })
    },
    getCategories() {
      API[this.$route.path].categories({}).then((res) => {
        this.tabList = res.data || []
        this.selectTab = this.tabList[0].csCategoryId
        this.getSessionList(this.tabList[0].csCategoryId)
      }).catch((err) => {
        console.log(err)
      })
    },
    async getSessionList(csCategoryId) {
      // const { data } = await API[this.$route.path].sessionList({ csCategoryId })
      // this.list = data || []
      // console.log('data', data)
      await API[this.$route.path].sessionList({ csCategoryId }).then((res) => {
        this.list = res.data || []
        this.isEmptyList = !this.list.length
        let allUnreadNum = false
        this.list.forEach(item => {
          if (item.unReadNum !== 0) {
            allUnreadNum = true
          }
        })
        if (allUnreadNum) {
          this.tabList.forEach(item => {
            if (item.csCategoryId === this.selectTab) {
              item.unReadNum = 1
            }
          })
        } else {
          this.tabList.forEach(item => {
            if (item.csCategoryId === this.selectTab) {
              item.unReadNum = 0
            }
          })
        }
      }).catch((err) => {
        console.log(err)
      })
    },
    onInputSearch() {
      if (this.keyWord.length === 0) {
        this.isSearch = false
      }
    },
    onSearch() {
      // console.log('onSearch', this.keyWord)
      if (this.keyWord.trim().length === 0) {
        return
      }
      API[this.$route.path].searchUserPackerv2({ keyWord: this.keyWord }).then((res) => {
        this.searchList = res.data.deskSearchUserPackerVOList || []
        if (this.searchList.length === 0) {
          this.$message.error('没有搜索到相关信息')
          return
        }
        this.isSearch = true
      }).catch((err) => {
        console.log(err)
      })
    },
    onSelectTab(v) {
      this.list = []
      this.getSessionList(this.selectTab)
    },
    onClickItem(v) {
      // console.log(v,'v')
      this.cacheItem = v;
      setTimeout(() => {
        this.openSession(v)
      }, 1)
    },
    openSession(v, search) {
      var params = {
        csCategoryId: search ? v.categoryId : v.csCategoryId,
        appUserId: v.appUserId
      }
      API[this.$route.path].openSession({ ...params }).then((res) => {
        v.sessionTaskId = res.data.sessionTaskId
        if (search) {
          API[this.$route.path].sessionList({ csCategoryId: v.categoryId }).then((res) => {
            this.list = res.data || []
            this.list.forEach((item) => {
              if (item.taskId === v.sessionTaskId) {
                this.currentItem = item
                return
              }
            })
            this.keyWord = ''
            this.$emit('select', this.currentItem)
            this.getNewUserPool()
          }).catch((err) => {
            console.log(err)
          })
        } else {
          this.currentItem = v
          this.$emit('select', v)
        }

        this.isSearch = false
      }).catch((err) => {
        console.log('opensession', err)
      })
    },
    onClickSearchItem(item) {
      item.appUserId = item.uid
      this.selectTab = item.categoryId
      this.openSession(item, true)
    },
    onScroll(v) {
      const el = v.target
      if (el.scrollTop + el.clientHeight >= el.scrollHeight) {
        // this.getNewUserPool()
        console.log('到底啦')
      }
    }
  }
}
</script>

<style scoped lang='scss'>
.left-group-contain{
  width: 370px;
  min-width: 370px;
  max-width: 370px;
  .list-title{
    width: 80px;
    text-align: center;
    .red-group{
      background-color: red;
      width: 10px;
      height: 10px;
      position: absolute;
      top: 2px;
      right: 2px;
      border-radius: 50%;
    }
  }
  .list-group{
     height: calc(100vh - 190px);
     overflow: auto;
     border-left: 1px solid rgb(240,240,240);
     border-bottom: 1px solid rgb(240,240,240);
     .list-item-group{
       height: 65px;
       width: 100%;
       border-bottom: 1px solid rgb(240,240,240);
       display: flex;
       flex-direction: column;
       justify-content: space-around;
       font-size: 14px;
       padding: 8px 0px;
      cursor: pointer;

       .list-item{
         margin: 0 10px;
         display: flex;
         justify-content: space-between;
         align-items: center;
         height: 18px;
         line-height: 18px;
          .left{
            width: 180px;
          }
          .left-bottom{
            width: 180px;
            font-size: 12px;
            color: rgb(150,150,150);
          }
          .right{
            color: rgb(45,45,45);
          }
         .right-unread{
            width: 18px;
            height: 18px;
            background-color: red;
            border-radius: 50%;
            color: white;
            text-align: center;
            line-height: 18px;
         }
       }
     }
     .list-item-group:hover{
       @extend .list-item-group;
       background: rgb(240,240,240);
     }
     .list-item-group-press{
       @extend .list-item-group;
       background: rgb(240,240,240);
     }
  }
  .not-contacted-box{
    margin-left: 121px;
    border-left: 1px solid rgb(240,240,240);
    .not-contacted-user{
      position: relative;
      left: 50%;
      transform: translateX(-50%);
      margin-top: 18px;
      margin-bottom: 10px;
    }
  }

  .search-list-group{
    .list-item{
      display: flex;
      height: 65px;
      justify-content: space-between;
      padding: 10px 10px;
      border-bottom: 1px solid rgb(240,240,240);

      align-items: center;
      font-size: 14px;
      .left-group{
        height: 100%;
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        justify-content: space-around;

        .mobile{
          color: #333;
        }
      }
      .right-group{
        color: #333;
      }
    }
    .list-item:hover{
      @extend .list-item;
      background: rgb(240,240,240);
    }
  }

}
 .not-contacted-user-group{
    height: 500px;
    overflow: auto;
  }
.ellipsis{
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
::v-deep .el-tabs--left .el-tabs__header.is-left{
  margin-right: 0px;
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