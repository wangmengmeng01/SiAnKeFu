<template>
  <div class="preview-live">
    <el-button :type="btnType" plain :size="btnSize" @click="init"><slot /></el-button>
    <el-dialog title="预览" :visible.sync="visible" :close-on-click-modal="false" top="5vh" width="960px" append-to-body @close="player.pause(),player.dispose(),player=null">
      <div v-if="visible" id="ali-player" />
    </el-dialog>
  </div>
</template>

<script>
import API from '@/api/live-manager'
export default {
  name: 'PreviewLive',
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
    id: String
  },
  data() {
    return {
      visible: false,
      player: null
    }
  },
  methods: {
    init() {
      API[this.$route.path].selectRoomInfo({ id: this.id }).then((res) => {
        const { livePullInfoDTOs } = res.data
        this.visible = true
        return Promise.resolve(livePullInfoDTOs)
      }).then((arr) => {
        if (!Array.isArray(arr) || arr.length === 0) {
          return Promise.reject('直播信息获取失败')
        }
        // eslint-disable-next-line no-undef
        this.player = new Aliplayer({
          'id': 'ali-player',
          'source': arr[2].originPullUrl,
          'width': '100%',
          'height': '540px',
          'autoplay': true,
          'isLive': true,
          'rePlay': false,
          'playsinline': true,
          'preload': true,
          'controlBarVisibility': 'hover',
          'useH5Prism': true
        }, function(player) {
          console.log('The player is created')
        })
      }).catch(err => {
        if (typeof err === 'string') {
          this.$message.error(err)
        }
      })
    }
  }
}
</script>
<style lang="scss" scoped>
.preview-live{
  display: inline-block;
  margin-right: 15px;
}
</style>
