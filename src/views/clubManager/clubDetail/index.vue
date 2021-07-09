<template>
  <div v-cloak class="app-container user-detail">
    <el-page-header title="返回" :content="`俱乐部详情`" style="margin-bottom: 15px;" @back="$router.back()" />
    <h4>俱乐部基础信息</h4>
    <div v-if="detailInfo.clubInfo" class="detail-model base-model">
      <club-label-item v-for="item in baseModelCol" :key="item.label" :label="getLable(item)" :value="detailInfo.clubInfo[item.value]" class="base-item">
        <!-- 嘉宾 -->
        <template v-if="item.slot==='honouredGuestList'">
          <el-row type="flex" align="middle">
            <el-button v-for="(guest, index) in detailInfo[item.value]" :key="index" size="mini" type="text" style="margin-right: 4px;" @click="$router.push({path:'/user-manager/user-detail', query:{ uid: guest.uid}})">{{ guest.nickname }}</el-button>
          </el-row>
        </template>
        <!-- 成员 -->
        <template v-if="item.slot==='normalMembers'">
          <el-row type="flex" align="middle">
            <el-button v-for="(member, index) in detailInfo[item.value]" :key="index" size="mini" type="text" style="margin-right: 4px;" @click="$router.push({path:'/user-manager/user-detail', query:{ uid: member.uid}})">{{ member.nickname }}</el-button>
          </el-row>
        </template>
      </club-label-item>
    </div>
    <div v-if="detailInfo.statistics" class="detail-model base-model">
      <club-label-item v-for="item in statisticsModelCol" :key="item.label" :label="getLable(item)" :value="detailInfo.statistics[item.value]" class="base-item" />
    </div>
    <el-divider />
    <h4>俱乐部历史</h4>
    <el-row v-for="(item, index) in detailInfo.clubEventList" :key="index" type="flex" align="middle" style="margin-bottom: 20px;">
      <template v-if="[3, 4, 5].includes(item.eventType)">
        <span>{{ item.eventTime }}</span>
        <template v-if="getMember(item)">
          <el-button type="text" style="margin-right: 4px; margin-left: 60px;" @click="$router.push({path:'/user-manager/user-detail', query:{ uid: item.memberUid}})">{{ getMember(item) }}</el-button>
          <span>{{ getEvent(item) }}</span>
        </template>
        <span v-else style="margin-left: 60px;">{{ getEvent(item) }}</span>
      </template>
      <template v-else>
        <span>{{ item.eventTime }}</span><span style="margin-left: 60px;">{{ item.eventContent }}</span>
      </template>
    </el-row>
  </div>
</template>

<script>

import API from '@/api/club-manager'
import clubLabelItem from './club-label-item'

export default {
  name: 'ClubDetail',
  components: {
    clubLabelItem
  },
  data() {
    return {
      detailInfo: {
        clubInfo: {}, // 俱乐部信息
        normalMembers: [], // 普通成员列表
        honouredGuestList: [], // 嘉宾列表
        statistics: [], // 统计相关
        clubEventList: [] // 俱乐部历史记录
      }
    }
  },
  computed: {
    baseModelCol() {
      return [
        { label: '老板昵称', value: 'clubCreateNickname' },
        { label: '嘉宾', value: 'honouredGuestList', slot: 'honouredGuestList' },
        { label: '成员', value: 'normalMembers', slot: 'normalMembers' },
        { label: '创建时间', value: 'clubCreateTime' },
        { label: '激活时间', value: 'firstActiveTime' }
      ]
    },
    statisticsModelCol() {
      return [
        { label: '累计钻石消耗', value: 'diamondCostCount' },
        { label: '累计收益金币', value: 'goldIncomeCount' },
        { label: '累计消息条数', value: 'messageCount' },
        { label: '累计心情数', value: 'moodCount' },
        { label: '累计任务数', value: 'taskCount' },
        { label: '新人申请数（主动）', value: 'applyCount' },
        { label: '新人申请数（系统推荐）', value: 'applySystemRecommendCount' }
      ]
    }
  },
  beforeCreate() {
    this.$api = API[this.$route.path]
  },
  mounted() {
    this.getClubDetail()
  },
  methods: {
    getClubDetail() {
      this.detailInfo = {
        clubInfo: {}, // 俱乐部信息
        normalMembers: [], // 普通成员列表
        honouredGuestList: [], // 嘉宾列表
        statistics: [], // 统计相关
        clubEventList: [] // 俱乐部历史记录
      }
      this.$api.getClubDetail({ clubId: this.$route.query.clubId }).then((res) => {
        const { data } = res
        this.detailInfo = { ...data }
      }).catch((err) => {
        console.log(err)
      })
    },
    getLable(item) {
      if (item.value === 'honouredGuestList') {
        return `嘉宾（${this.detailInfo[item.value].length}）`
      }
      if (item.value === 'normalMembers') {
        return `成员（${this.detailInfo[item.value].length}）`
      }
      return item.label
    },
    getMember(item) {
      const list = item.eventContent.split(' ')
      const member = list.length > 0 ? list[0] : null
      return member
    },
    getEvent(item) {
      const list = item.eventContent.split(' ').slice(-1) || []
      const event = list.length > 0 ? list[0] : ''
      return event
    }
  }
}
</script>
<style lang="scss" scoped>
[v-cloak]{
  display: none;
}
.user-detail {
    width: 100%;
    min-width: 1200px;
    .detail-model {
        &.base-model {
            .base-item {
                display: inline-flex;
                align-items: center;
                justify-content: space-between;
                width: 33%;
                padding: 0 20px;
            }
        }
    }
}
</style>
