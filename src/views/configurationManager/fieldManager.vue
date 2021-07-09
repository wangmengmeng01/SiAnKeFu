<template>
  <div class="bg">
  	<div>
  		<el-button @click="show" type="primary" icon="el-icon-plus">新增</el-button>
  		<span style="margin-left: 20px;color: #666;">新增字段后，运营人员可在后台【用户详情】内对于用户的此字段做自定义备注。如“QQ号”等。</span>
  	</div>
  	<div>
  		<el-tag
  			style="margin-right: 10px;margin-top: 20px;"
			  v-for="tag in list"
			  :key="tag.name"
			  >
			  {{tag.name}}
			</el-tag>
  	</div>
		<el-dialog
		  :title="title"
		  :visible.sync="flag"
		  width="400px"
		  >
		  <el-form :model="addForm" ref="addForm" label-width="10px">
			  <el-form-item
			    label=""
			    prop="name"
			    :rules="[
			      { required: true, message: '该项必填'},
			    ]"
			  >
			    <el-input maxlength="10" v-model.trim="addForm.name" placeholder="请输入字段名称（10个字以内）"></el-input>
			  </el-form-item>
			</el-form>
			<span slot="footer" class="dialog-footer">
		    <el-button @click="resetForm('addForm')">取 消</el-button>
		    <el-button type="primary" @click="submitForm('addForm')">确 定</el-button>
		  </span>
		</el-dialog>
  </div>
</template>

<script>
// @ is an alias to /src
import {
  createField,
  findAllField,
} from '@/api/configManager.js'
export default {
  name: 'field-manager',
  components: {
  },
  data() {
    return {
    	flag: false,
    	title: '新增',
    	list: [],
    	addForm: {
    		name: '',
    	},
    }
  },
  created() {
  	this.findAllField();
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
          this.createField();
        } else {
          console.log('error submit!!');
          return false;
        }
      });
    },
		createField() {
      createField(this.addForm).then(res => {
        if (res.success) {
        	this.$message({
            type: 'success',
            message: '新增成功!'
          });
					this.flag = false;
          this.findAllField();
        }else {
					this.$message({
            type: 'error',
            message: '新增失败!'
          });
        }
      }).catch(err => {

      })
    },
    findAllField() {
      findAllField({}).then(res => {
        if (res.success) {
					this.list = res.data;
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