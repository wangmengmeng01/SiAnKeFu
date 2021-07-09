<template>
  <div class="bg">
  	<div>
  		<span style="margin-left: 20px;color: #000;font-weight: bold;">验证码设置</span>
  	</div>
    <div style="padding-left: 150px;margin: 30px 0;">
      <el-radio-group @change="findOne" v-model="addForm.regionType">
        <el-radio-button label="1">中国大陆</el-radio-button>
        <el-radio-button label="2">国际/港澳台</el-radio-button>
      </el-radio-group>
    </div>
  	<el-form :model="addForm" style="width: 600px;" ref="addForm" label-width="150px">
		  <el-form-item
		    label="签名："
		    prop="signName"
		    :rules="[
		      { required: true, message: '该项必填'},
		    ]"
		  >
		    <el-input v-model="addForm.signName" placeholder="请输入您的短信签名"></el-input>
        <span style="color: #666;">（请在阿里云短信控制台申请短信签名通过后，再填入此处）</span>
		  </el-form-item>
      <el-form-item
        label="模版CODE："
        prop="smsCode"
        :rules="[
          { required: true, message: '该项必填'},
        ]"
      >
        <el-input v-model="addForm.smsCode" placeholder="请输入您的短信模版CODE"></el-input>
      </el-form-item>
      <el-form-item
        label="模版内容："
        prop="templateContent"
        :rules="[
          { required: true, message: '该项必填'},
        ]"
      >
        <el-input type="textarea" v-model="addForm.templateContent" placeholder="验证码${Code}，您正在登录xx，10分钟内有效。切勿将验证码告知他人，以防帐
号被盗！"></el-input>
      </el-form-item>
      <el-button @click="saveNote" type="primary" style="margin-left: 150px;">保存</el-button>
		</el-form>
  </div>
</template>

<script>
// @ is an alias to /src
import {
  saveNote,
  findOne,
} from '@/api/configManager.js'
export default {
  name: 'note-manager',
  components: {
  },
  data() {
    return {
    	flag: false,
    	title: '新增',
    	list: [],
    	addForm: {
    		regionType: '1',
        smsCode: '',
        signName: '',
        templateContent: '',
    	},
    }
  },
  created() {
  	this.findOne();
  },
  mounted() {
  },
  methods: {
		show(formName) {
			this.flag = true;
      this.addForm = {
    		name: '',
    	};
    },
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.saveNote();
        } else {
          console.log('error submit!!');
          return false;
        }
      });
    },
		saveNote() {
      saveNote(this.addForm).then(res => {
        if (res.success) {
        	this.$message({
            type: 'success',
            message: '新增成功!'
          });
					this.flag = false;
          this.findOne();
        }else {
					this.$message({
            type: 'error',
            message: '新增失败!'
          });
        }
      }).catch(err => {

      })
    },
    findOne() {
      findOne({regionType: this.addForm.regionType}).then(res => {
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