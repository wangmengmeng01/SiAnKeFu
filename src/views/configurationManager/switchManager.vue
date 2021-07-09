<template>
  <div class="bg">
  	<div style="margin-bottom: 50px;">
  		<span style="font-weight: bold;margin-right: 20px;">注册码开关</span>
  		<el-radio-group v-model="addForm.switchRegistrationCode">
		    <el-radio :disabled="flag" :label="true">开启</el-radio>
		    <el-radio :disabled="flag" :label="false">关闭</el-radio>
		  </el-radio-group>
  	</div>
  	<div style="padding-left: 100px;">
  		<el-button v-if="flag" @click="flag = false" type="primary">修改配置</el-button>
  		<span v-else>
	  		<el-button @click="flag = true" type="primary">取消</el-button>
	  		<el-button @click="updateSwitchConfig" type="primary">提交</el-button>

  		</span>
  	</div>
  </div>
</template>

<script>
// @ is an alias to /src
import {
  updateSwitchConfig,
  getSwitchConfig,
} from '@/api/configManager.js'
export default {
  name: 'source-manager',
  components: {
  },
  data() {
    return {
    	flag: true,
    	addForm: {
    		switchRegistrationCode: '',
    	},
    }
  },
  created() {
  	this.getSwitchConfig();
  },
  mounted() {
  },
  methods: {
		updateSwitchConfig() {
      updateSwitchConfig(this.addForm).then(res => {
        if (res.success) {
        	this.$message({
            type: 'success',
            message: '修改成功!'
          });
					this.flag = true;
          this.getSwitchConfig();
        }else {
					this.$message({
            type: 'error',
            message: '修改失败!'
          });
        }
      }).catch(err => {

      })
    },
    getSwitchConfig() {
      getSwitchConfig({}).then(res => {
        if (res.success) {
					this.addForm = res.data;
        }else {
        }
      }).catch(err => {

      })
    },
		resetForm(formName) {
      this.$refs[formName].resetFields();
      this.flag = false;
    },
    get(i) {
    }
  }
}
</script>
<style lang="scss" scoped>
.bg {
	padding: 30px;
}
</style>