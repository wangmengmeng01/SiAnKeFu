<template>
  <div class="view-announcement">

    <!-- button部分 -->
    <el-button :type="btnType" plain :size="btnSize" @click="init"><slot /></el-button>

    <!-- dialog部分 -->
    <el-dialog title="查看公告内容" :visible.sync="visible" :close-on-click-modal="false" width="800px" top="5vh" append-to-body @close="reset">

      <el-form ref="form" :model="form" label-position="right" label-width="100px">
        <el-form-item label="公告类型：">
          {{ ['', '图文消息', '图文链接'][form.type] }}
        </el-form-item>
        <el-form-item label="是否推送：">
          {{ ['否', '是'][form.isPush] }}
        </el-form-item>
        <el-form-item v-if="form.type===2" label="公告标题：">
          {{ form.title }}
        </el-form-item>
        <el-form-item v-if="form.type===1" label="内容类型：">
          {{ ['', '文字', '图片'][form.contentType] }}
        </el-form-item>
        <el-form-item :label="form.type===2?'公告简介：':'公告内容：'">
          <span v-if="form.type===2 || form.contentType===1">{{ form.content }}</span>
          <el-image v-if="form.contentType===2" :src="form.content" style="width: 100px; height: 100px;" :preview-src-list="[form.content]" />
        </el-form-item>
        <el-form-item v-if="form.type===2" label="跳转链接：">
          {{ form.redirectUrl }}
        </el-form-item>
        <el-form-item v-if="form.type===2" label="封面图：">
          <el-image v-if="!!form.cover" :src="form.cover" style="width: 100px; height: 100px;" :preview-src-list="[form.cover]" />
        </el-form-item>
        <el-form-item label="发布方式：">
          {{ ['立即发布', '定时发布'][form.isSchedulePublish] }}
        </el-form-item>
        <el-form-item v-if="form.isSchedulePublish===1" label="发布时间：">
          {{ form.presetPublishTime }}
        </el-form-item>
      </el-form>

    </el-dialog>

  </div>
</template>

<script>
export default {
  name: 'ViewAnnouncement',
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
      form: {
        type: '',
        isPush: '',
        title: '',
        contentType: '',
        content: '',
        redirectUrl: '',
        cover: '',
        isSchedulePublish: '',
        presetPublishTime: ''
      }
    }
  },
  methods: {
    init() {
      this.form = Object.assign({}, this.form, this.row)
      this.visible = true
    },
    reset() {
      this.$refs.form.resetFields()
    }
  }
}
</script>
<style lang="scss" scoped>
  .view-announcement {
    display: inline-block;
    margin-right: 15px;
  }
</style>
