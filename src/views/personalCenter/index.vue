<template>
  <div class="app-container" style="margin: 10px 150px 100px 150px;">
    <el-row :gutter="20">
      <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
        <el-card class="box-card" style="padding-bottom: 300px;">
          <div slot="header" class="clearfix">
            <span>个人信息</span>
          </div>
          <div>
            <ul class="user-info">
              <li><div style="height: 100%"><svg-icon icon-class="login" /> 登录账号<div class="user-right">{{ name }}</div></div></li>
              <li><svg-icon icon-class="user1" /> 用户姓名 <div class="user-right">{{ realName }}</div></li>
              <li>
                <svg-icon icon-class="anq" /> 安全设置
                <div class="user-right">
                  <a @click="toggleDialog">修改密码</a>
                </div>
              </li>
            </ul>
          </div>
        </el-card>
      </el-col>
    </el-row>
    <ModifyPassword v-model="dialogFormVisible" />
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
  name: 'Profile',
  components: {
    ModifyPassword: () => import('@/components/ModifyPassword')
  },
  data() {
    return {
      dialogFormVisible: false
    }
  },
  computed: {
    ...mapGetters([
      'name',
      'realName'
    ])
  },
  methods: {
    toggleDialog() {
      this.dialogFormVisible = !this.dialogFormVisible
    }
  }
}
</script>

<style lang="scss" scoped>
  .user-info {
    padding-left: 0;
    list-style: none;
    li{
      border-bottom: 1px solid #F0F3F4;
      padding: 11px 0;
      font-size: 13px;
    }
    .user-right {
      float: right;

      a{
        color: #317EF3;
      }
    }
  }
</style>
