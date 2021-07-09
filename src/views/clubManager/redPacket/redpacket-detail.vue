<template>
  <div class="container">
    <!-- button部分 -->
    <el-button :type="btnType" plain :size="btnSize" @click="init"><slot /></el-button>
    <!-- dialog部分 -->
    <el-dialog :title="title" center :visible.sync="visible" :close-on-click-modal="false" width="800px" top="5vh" append-to-body @close="reset">
      <el-row type="flex" justify="center" align="middle">
        <span>{{ `(${detailInfo.statusName},${detailInfo.redBagAmount}个红包共${detailInfo.totalValue}金币)` }}</span>
      </el-row>
      <el-row type="flex" justify="center" align="middle" style="margin-top: 20px; margin-bottom: 20px;">
        <span>{{ detailInfo.comment }}</span>
      </el-row>
      <el-row v-for="(item, index) in detailInfo.pickItems" :key="index" type="flex" justify="space-between" align="middle" style="margin-bottom: 20px;">
        <el-row type="flex" align="middle">
          <el-image style="width: 50px; margin-right: 10px;" :src="item.userAvatar" :preview-src-list="[item.userAvatar]" />
          <div>
            <p>{{ item.userName }}</p>
            <p>{{ item.takeTime }}</p>
          </div>
        </el-row>
        <span>+{{ item.gold }}金币</span>
      </el-row>
    </el-dialog>
  </div>
</template>

<script>
import API from '@/api/club-manager'
export default {
  name: 'RedpacketDetail',
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
      title: '',
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
      API[this.$route.path].getDetail({ redId: this.row.redPacketId }).then((res) => {
        this.detailInfo = res.data
        this.title = res.data.fromUserName
      }).catch((err) => {
        console.log(err)
      })
    },
    reset() {

    }
  }
}
</script>
<style lang="scss" scoped>
  .container {
    display: inline-block;
    margin-right: 15px;
  }
</style>
