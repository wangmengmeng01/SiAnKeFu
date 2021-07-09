<template>
  <div class="add-edit-announcement">

    <!-- button部分 -->
    <el-button :type="btnType" :icon="type==='edit'?'':'el-icon-plus'" :plain="type==='edit'" :size="btnSize" @click="init"><slot /></el-button>

    <!-- dialog部分 -->
    <el-dialog :title="type==='edit'?'编辑公告':'发布公告'" :visible.sync="visible" :close-on-click-modal="false" width="800px" top="5vh" append-to-body @close="reset">

      <el-form ref="form" :rules="rules" :model="form" label-position="right" label-width="100px">
        <el-form-item label="公告类型" prop="type">
          <el-radio-group v-model="form.type" size="small" @change="form.title='',form.contentType=1, form.content='', form.redirectUrl='', form.cover='',$refs.form.clearValidate()">
            <el-radio :label="2" border>图文链接</el-radio>
            <el-radio :label="1" border>图文内容</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="是否推送" prop="isPush">
          <el-radio-group v-model="form.isPush">
            <el-radio :label="1">是</el-radio>
            <el-radio :label="0">否</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item v-if="form.type===2" label="公告标题" prop="title" :rules="[{required: form.type===2, message: '请输入公告标题'}]">
          <el-input v-model="form.title" placeholder="请输入公告标题，10个字以内" maxlength="10" />
        </el-form-item>
        <el-form-item v-if="form.type===1" label="内容类型" prop="contentType" :rules="[{required: form.type===1, message: '请选择内容类型'}]">
          <el-radio-group v-model="form.contentType" @change="form.content=''">
            <el-radio :label="1">文字</el-radio>
            <el-radio :label="2">图片</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item :label="form.type===2?'公告简介':'公告内容'" prop="content" :rules="[{required: true, message: contentRequiredMessage}]">
          <el-input v-if="form.type===2 || form.contentType===1" v-model="form.content" :placeholder="`编辑你想要发送的内容，${form.type===2?'30':'100'}字以内`" type="textarea" :autosize="{ minRows: 2, maxRows: 5 }" :maxlength="form.type===2?30:100" />
          <sa-upload v-if="form.contentType===2" v-model="form.content" accept="image/jpg,, image/jpeg, image/png" style="width: 100px; height: 100px;" />
        </el-form-item>
        <el-form-item v-if="form.type===2" label="跳转链接" prop="redirectUrl" :rules="[{required: form.type===2, message: '请输入需要跳转的链接'}, {pattern: new RegExp('[a-zA-z]+://[^\\s]*'), message: '链接格式不正确'}]">
          <el-input v-model="form.redirectUrl" placeholder="请输入需要跳转的链接" />
        </el-form-item>
        <el-form-item v-if="form.type===2" label="封面图" prop="cover">
          <sa-upload v-model="form.cover" accept="image/jpg, image/jpeg, image/png" :size="2" style="width: 100px; height: 100px;" />
        </el-form-item>
        <el-form-item label="发布方式" prop="isSchedulePublish">
          <el-radio-group v-model="form.isSchedulePublish">
            <el-radio :label="0">立即发布</el-radio>
            <el-radio :label="1">定时发布</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item v-if="form.isSchedulePublish===1" label="发布时间" prop="presetPublishTime" :rules="[{required: form.isSchedulePublish===1, message: '请选择发布时间'}]">
          <el-date-picker v-model="form.presetPublishTime" value-format="yyyy-MM-dd HH:mm:ss" type="datetime" placeholder="选择发布时间" />
        </el-form-item>
      </el-form>

      <div class="last-form-item">
        <el-button :loading="loading" type="primary" @click="submit">确定</el-button>
        <el-button @click="visible = false">取消</el-button>
      </div>

    </el-dialog>

  </div>
</template>

<script>
import API from '@/api/announcement-manager'
import { fixOssPre } from '@/utils'
import saUpload from '@/components/UploadCloud'
export default {
  name: 'AddEditAnnouncement',
  components: { saUpload },
  props: {
    btnType: {
      type: String,
      default: 'primary'
    },
    btnSize: {
      type: String,
      default: 'small'
    },
    type: { // edit为编辑态 add为新增
      type: String,
      default: ''
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
        type: 1,
        isPush: 1,
        title: '',
        contentType: 1,
        content: '',
        redirectUrl: '',
        cover: '',
        isSchedulePublish: 0,
        presetPublishTime: ''
      },
      rules: {
        type: [{ required: true, message: '请选择公告类型' }],
        isPush: [{ required: true, message: '请选择是否推送' }],
        isSchedulePublish: [{ required: true, message: '请选择发布方式' }]
      },
      loading: false
    }
  },
  computed: {
    contentRequiredMessage() {
      if (this.form.type === 2) {
        return '请输入公告简介'
      } else {
        if (this.form.contentType === 1) {
          return '请输入公告内容'
        } else if (this.form.contentType === 2) {
          return '请上传公告图片'
        } else {
          return '请输入内容'
        }
      }
    }
  },
  methods: {
    init() {
      if (this.type === 'edit' && !!this.row) {
        this.form = Object.assign({}, this.form, this.row)
      }
      this.visible = true
    },
    submit() {
      this.$refs.form.validate(valid => {
        if (valid) {
          this.loading = true
          const params = {
            ...this.form,
            content: this.form.contentType === 2 ? fixOssPre(this.form.content) : this.form.content,
            cover: this.form.type === 2 ? fixOssPre(this.form.cover) : this.form.cover
          }
          API[this.$route.path][this.type === 'edit' ? 'update' : 'publish'](params).then(() => {
            this.loading = false
            this.$emit('success')
            this.$message.success('操作成功')
            this.visible = false
          }).catch(error => {
            console.log(error)
            this.loading = false
          })
        }
      })
    },
    reset() {
      this.$refs.form.resetFields()
    }
  }
}
</script>
<style lang="scss" scoped>
  .add-edit-announcement {
    display: inline-block;
    margin-right: 15px;
  }
</style>
