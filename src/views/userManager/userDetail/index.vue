<template>
  <div v-cloak class="app-container user-detail">
    <el-page-header title="返回" :content="`用户详情`" style="margin-bottom: 15px;" @back="$router.back()" />
    <h4>基础信息模块</h4>
    <div class="detail-model base-model">
      <label-value-item v-for="item in baseModelCol" :key="item.label" :label="item.label" :value="userInfo[item.value]" class="base-item">
        <!-- 昵称slot -->
        <edit-nick-name v-if="item.slot==='nickName'" :value="userInfo[item.value]" @success="getUserInfo" />
        <!-- 头像slot -->
        <edit-avatar v-if="item.slot==='avatar'" :value="userInfo[item.value]" @success="getUserInfo" />
        <!-- 性别 -->
        <template v-if="item.slot==='sex'">
          {{ ['', '男', '女'][userInfo[item.value]] }}
        </template>
        <!-- 头像是否真人 -->
        <template v-if="item.slot==='isRealPeopleAvatar'">
          {{ userInfo[item.value]?'是':'否' }}
        </template>
        <!-- 身高体重 -->
        <template v-if="item.slot==='height'">
          {{ userInfo.height }}cm / {{ userInfo.weight }}Kg
        </template>
        <!--  常住地 -->
        <template v-if="item.slot==='residences'">
          {{ Array.isArray(userInfo.residences) ? userInfo.residences.map(i => i.name).toString() : '' }}
        </template>
        <!--  VIP身份 -->
        <template v-if="item.slot==='vipFlag'">
          {{userInfo.vipFlag ? '是' : '否'}}
        </template>

        <!--  来源平台 -->
        <template v-if="item.slot==='sourceType'">
          <div>
            <el-select size="mini" style="width: 100px;" v-model="userInfo.sourceType" :disabled="sourceFlag" placeholder="请选择">
              <el-option
                v-for="t in list"
                :key="t.id"
                :label="t.name"
                :value="t.id">
              </el-option>
            </el-select>
            <span class="btn" v-show="sourceFlag" @click="sourceFlag = false">修改</span>
            <span class="btn" v-show="!sourceFlag"  @click="sourceFlag = true,userInfo.sourceType = userInfo.sourceTypeOld">取消</span>
            <span class="btn" v-show="!sourceFlag" @click="editByUid">提交</span>
          </div>
        </template>
        <!--  来源平台唯一ID -->
        <template v-if="item.slot==='sourceId'">
          <div>
            <el-input v-model="userInfo.sourceId" placeholder="未填写" size="mini" style="width: 100px;" :disabled="sourceIdFlag"></el-input>
            <span class="btn" v-show="sourceIdFlag" @click="sourceIdFlag = false">修改</span>
            <span class="btn" v-show="!sourceIdFlag"  @click="sourceIdFlag = true,userInfo.sourceId = userInfo.sourceIdOld">取消</span>
            <span class="btn" v-show="!sourceIdFlag" @click="editByUid1">提交</span>
          </div>
        </template>
      </label-value-item>
      <div>
        <label-value-item label="关联客服马甲" class="base-item">
          <span v-for="T in userInfo.csPackerUser" @click="go(T.uid)" style="margin-left: 10px;color: #409EFF;">{{T.nickName}}</span>
        </label-value-item>
      </div>
    </div>
    <el-divider />
    <h4>其他信息模块</h4>
    <div class="detail-model other-model">
      <label-value-item v-for="item in otherModelCol" :key="item.label" :label="item.label" :value="userInfo[item.value]" class="other-item">
        <!-- 个性标签slot -->
        <template v-if="item.slot==='tags' && userInfo[item.value] && userInfo[item.value].length>0">
          <el-tag v-for="tag in userInfo[item.value]" :key="tag.tagId" size="mini" type="success" effect="dark" style="margin-right: 10px;margin-bottom: 10px;">{{ tag.tagName }}</el-tag>
        </template>
        <!-- 印象slot -->
        <template v-if="item.slot==='impressions' && userInfo[item.value] && userInfo[item.value].length>0">
          <el-tag v-for="tag in userInfo[item.value]" :key="tag.impressionId" size="mini" type="info" effect="dark" style="margin-right: 15px;">{{ tag.name }}</el-tag>
        </template>
        <!-- 语音签名slot -->
        <preview-delete-sign v-if="item.slot==='voiceSignature'" :value="userInfo" @success="getUserInfo" />
      </label-value-item>
      <label-value-item label="Ta的问答" class="other-item" style="width: 100%;">
        <!-- 问答slot -->
        <view-delete-answers :answers="userInfo.answers" @success="getUserInfo" />
      </label-value-item>
    </div>
    <el-divider />
    <h4>编辑备注模块</h4>
    <div class="detail-model permission-model">
      <label-value-item v-for="item in userInfo.attributes" :key="item.attributeId" :label="item.name" class="permission-item">
        <div>
          <el-input v-model="item.value" placeholder="未填写" size="mini" style="width: 100px;" :disabled="item.flag"></el-input>
          <span class="btn" v-show="item.flag" @click="item.flag = false">修改</span>
          <span class="btn" v-show="!item.flag"  @click="item.flag = true,item.value = item.valueOld">取消</span>
          <span class="btn" v-show="!item.flag" @click="setAttributeValue(item)">提交</span>
        </div>
      </label-value-item>
    </div>
    <el-divider />
    <h4>客服系统接入记录</h4>
    <div class="detail-model permission-model">
      <record  :showRemarkBtn="false" :currentSelectSession="currentSelectSession"></record>
    </div>
  </div>
</template>

<script>

import API from '@/api/user-manager'
import {
  editByUid,
  setAttributeValue,
  findAllSource,
} from '@/api/configManager.js'
import labelValueItem from './label-value-item'
import editNickName from './edit-nick-name'
import editIdentification from './edit-identification'
import editAvatar from './edit-avatar'
import editLivePermission from './edit-live-permission'
import previewDeleteSign from './preview-delete-sign'
import viewDeleteAnswers from './view-delete-answers'
import editClubPermission from './edit-club-permission'
import record from '@/views/customerManagement/customerWorkbench/right-group/components/index.vue'
import editExperienceCardPermission from './edit-experience-card-permission.vue'
export default {
  name: 'UserDetail',
  components: { labelValueItem, editNickName, editClubPermission, editIdentification, editAvatar, editLivePermission, previewDeleteSign, viewDeleteAnswers, editExperienceCardPermission ,record},
  data() {
    return {
      currentSelectSession: {
        appUserId: '',
        taskId: '',
      },
      sourceFlag: true,
      sourceIdFlag: true,
      list: [],
      userInfo: {
        residences: {}, // 常驻地
        tags: {}, // 个性标签
        impressions: {}, // 印象
        voiceSignature: {}, // 语音签名
        csPackerUser: [], // 关联客服马甲
        answers: [] // 问答
      }
    }
  },
  computed: {
    baseModelCol() {
      return [
        { label: '昵称', value: 'nickName', slot: 'nickName' },
        { label: 'ID', value: 'saId' },
        { label: '性别', value: 'sex', slot: 'sex' },
        { label: '头像', value: 'avatar', slot: 'avatar' },
        { label: '手机号', value: 'mobile' },
        { label: '出生日期', value: 'birthday' },
        { label: '头像是否真人', value: 'isRealPeopleAvatar', slot: 'isRealPeopleAvatar' },
        { label: '钻石', value: 'diamondNumber' },
        { label: 'Ta的金币', value: 'goldNumber' },
        { label: 'Ta的粉丝', value: 'fansCount' },
        { label: 'Ta的关注', value: 'followCount' },
        // { label: 'Ta的好友', value: 'friendCount' },
        { label: '身高体重', value: 'height', slot: 'height' },
        // { label: '真实姓名', value: 'realName' },
        // { label: '身份证号', value: 'cardNo' },
        { label: '常住地', value: 'residences', slot: 'residences' },
        { label: 'VIP身份', value: 'vipFlag', slot: 'vipFlag' },
        // { label: '关联客服马甲', value: 'csPackerUser', slot: 'csPackerUser' },
        { label: '等级', value: 'level', },
        { label: '用户注册码', value: 'registrationCode', },
        { label: '来源平台', value: 'sourceType',  slot: 'sourceType'},
        { label: '来源平台唯一ID', value: 'sourceId',  slot: 'sourceId'},
      ]
    },
    permissionModelCol() {
      return [
        { label: '用户身份', value: 'identification', slot: 'identification' },
        { label: '直播权限', value: 'hasLivePermission', slot: 'livePermission' }
      ]
    },
    permissionModel() {
      return [
        { label: '俱乐部入口权限', value: 'switchClubQuickEntrance', slot: 'clubPermission' },
        { label: '体验卡入口权限', value: 'switchPrivilegeGiftEntrance', slot: 'experienceCardPermission' }
      ]
    },
    otherModelCol() {
      return [
        { label: 'Ta的个性标签', value: 'tags', slot: 'tags' },
        { label: 'Ta的印象标签', value: 'impressions', slot: 'impressions' },
        { label: 'Ta的语音签名', value: 'voiceSignature', slot: 'voiceSignature' }
      ]
    }
  },
  beforeCreate() {
    this.$api = API[this.$route.path]
  },
  created() {
    // this.$api = API[this.$route.path]
    this.currentSelectSession.appUserId = this.$route.query.uid;
  },
  mounted() {
    this.getUserInfo()
    this.findAllSource()
  },
  methods: {
    findAllSource() {
      findAllSource({}).then(res => {
        if (res.success) {
          res.data.push({id: 0, name: '未填写'})
          this.list = res.data;
        }else {
          this.$message({
            type: 'error',
            message: res.msg
          });
        }
      }).catch(err => {

      })
    },
    setAttributeValue(item) {
      setAttributeValue({value: item.value,attributeId: item.attributeId,uid: this.$route.query.uid}).then(res => {
        if (res.success) {
          item.flag = true;
          this.getUserInfo()
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
      editByUid({sourceType: this.userInfo.sourceType,uid: this.$route.query.uid}).then(res => {
        if (res.success) {
          this.sourceFlag = true;
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
    editByUid1() {
      editByUid({sourceId: this.userInfo.sourceId,uid: this.$route.query.uid}).then(res => {
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
    go(id) {
      this.$router.push({path: "/user-manager/user-detail",query:{uid: id}});
    },
    getUserInfo() {
      this.userInfo = {
        residences: {}, // 常驻地
        tags: {}, // 个性标签
        impressions: {}, // 印象
        voiceSignature: {}, // 语音签名
        answers: [], // 问答
      }
      this.$api.findUserDetailByUid({ uid: this.$route.query.uid }).then((res) => {
        const { data } = res
        data.attributes.forEach(item => {
          item.flag = true;
          item.valueOld = item.value;
        })
        this.userInfo = { ...data }
        this.userInfo.sourceTypeOld = this.userInfo.sourceType;
        this.userInfo.sourceIdOld = this.userInfo.sourceId;
      }).catch((err) => {
        console.log(err)
      })
    }
  }
}
</script>
<style lang="scss" scoped>
.btn {
  margin-left: 5px;
  color: #409EFF;
  font-size: 12px;
  white-space: nowrap;
}
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
                width: 25%;
                padding: 0 20px;
            }
        }
        &.permission-model {
            .permission-item {
                display: inline-flex;
                align-items: center;
                justify-content: space-between;
                width: 25%;
                padding: 0 20px;
            }
        }
        &.other-model {
            .other-item {
                display: inline-flex;
                align-items: center;
                justify-content: space-between;
                width: 33.3%;
                padding: 0 20px;
            }
        }
    }
}
</style>
