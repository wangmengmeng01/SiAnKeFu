<template>
  <div class="add-edit-gift">
    <el-button :type="btnType" :plain="type==='edit'" :icon="type==='edit'?'':'el-icon-plus'" :size="btnSize" @click="init"><slot /></el-button>
    <el-dialog :title="type==='edit'?'编辑礼物':'添加礼物'" :visible.sync="visible" :close-on-click-modal="false" width="1000px" top="5vh" append-to-body @close="reset">
      <el-form ref="form" :rules="rules" :model="form" label-position="right" label-width="100px">
        <el-form-item label="礼物类别" prop="giftType">
          <el-radio-group v-model="form.giftType" size="small" @change="form.playEffectUrl='', form.doubleHit=0">
            <el-radio :label="2" border>大礼物</el-radio>
            <el-radio :label="1" border>小礼物</el-radio>
            <!-- <el-radio :label="3" border>其它</el-radio> -->
          </el-radio-group>
        </el-form-item>
        <el-form-item label="礼物名称" prop="giftName">
          <el-input v-model="form.giftName" placeholder="请输入礼物名称" />
        </el-form-item>
        <el-form-item label="礼物单价" prop="giftPrice">
          <el-input v-model="form.giftPrice" maxlength="6">
            <template slot="append">钻石</template>
          </el-input>
        </el-form-item>
        <el-row>
          <el-col :span="8">
            <el-form-item label="礼物图标" prop="defaultGraphUrl">
              <sa-upload v-model="form.defaultGraphUrl" accept="image/png, image/jpeg" style="width: 100px; height: 100px;" :size="1">
                <p slot="tip">只能上传jpg/png文件，大小不超过1MB</p>
              </sa-upload>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <!-- prop="dynamicGraphUrl" -->
            <el-form-item label="预览效果">
              <sa-upload v-model="form.dynamicGraphUrl" accept="image/gif" style="width: 100px; height: 100px;" :size="1">
                <p slot="tip">只能上传gif文件，大小不超过1MB</p>
              </sa-upload>
            </el-form-item>
          </el-col>
          <el-col v-if="form.giftType===2 || form.giftType === 3" :span="8">
            <el-form-item label="播放效果" prop="playEffectUrl" :rules="[{required: form.giftType===2 || form.giftType ===3, message: '请上传播放效果'}]">
              <sa-upload v-model="form.playEffectUrl" accept="svga" file-type="svga" :download="true" :preview="false" style="width: 100px; height: 100px;" :size="20">
                <p slot="tip">只能上传svga文件，大小不超过20MB</p>
              </sa-upload>
            </el-form-item>
          </el-col>
          <!-- <el-col v-if="form.giftType===1" :span="8">
            <el-form-item label="可否连击" prop="doubleHit" :rules="[{required: form.giftType===1, message: '请选择可否连击'}]">
              <el-radio-group v-model="form.doubleHit">
                <el-radio :label="1">可连击</el-radio>
                <el-radio :label="0">不可连击</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col> -->
        </el-row>
        <el-row>
          <el-col :span="8">
            <el-form-item label="状态" prop="giftStatus">
              <dict-select v-model="form.giftStatus" dict-type="gift_status" :exclude="['-1']" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="排序" prop="sortNo">
              <el-input v-model="form.sortNo" maxlength="9" />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div class="last-form-item">
        <el-button :loading="loading" type="primary" @click="submit">保存</el-button>
        <el-button @click="visible = false">取消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import API from '@/api/gift-manager'
import Validate from '@/utils/validate'
import { fixOssPre } from '@/utils'
import saUpload from '@/components/UploadCloud'
import dictSelect from '@/components/DictSelect'
export default {
  name: 'AddEditGift',
  components: { saUpload, dictSelect },
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
        giftType: '',
        giftName: '',
        giftPrice: '',
        defaultGraphUrl: '',
        dynamicGraphUrl: '',
        playEffectUrl: '',
        doubleHit: 0,
        giftStatus: '',
        sortNo: ''
      },
      rules: {
        giftType: [Validate.required('礼物类别')],
        giftName: [Validate.required('礼物名称')],
        giftPrice: [Validate.required('礼物单价'), Validate.integer],
        defaultGraphUrl: [{ required: true, message: '请上传礼物图标' }],
        dynamicGraphUrl: [{ required: true, message: '请上传预览效果' }],
        giftStatus: [{ required: true, message: '请选择礼物状态' }],
        sortNo: [Validate.required('排序'), Validate.integer]
      },
      loading: false
    }
  },
  methods: {
    init() {
      if (this.type === 'edit' && !!this.row) {
        for (const key in this.form) {
          this.form[key] = this.row[key]
        }
        this.form = {
          ...this.form,
          giftId: this.row.giftId,
          giftStatus: this.row.giftStatus + ''
        }
      }
      this.visible = true
    },
    submit() {
      this.$refs.form.validate(valid => {
        if (valid) {
          this.loading = true
          const params = {
            ...this.form,
            defaultGraphUrl: fixOssPre(this.form.defaultGraphUrl || ''),
            dynamicGraphUrl: fixOssPre(this.form.dynamicGraphUrl || ''),
            playEffectUrl: fixOssPre(this.form.playEffectUrl || '')
          }
          API[this.$route.path][this.type === 'edit' ? 'update' : 'create'](params).then(() => {
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
  .add-edit-gift {
    display: inline-block;
    margin-right: 15px;
  }
</style>
