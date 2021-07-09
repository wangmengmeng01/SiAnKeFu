<template>
  <div class="bg">
  	<div style="margin-bottom: 30px;">
  		<el-button @click="show" type="primary" icon="el-icon-plus">新增</el-button>
  	</div>
  	<el-table
	    :data="list"
	    class="table-list-container"
	    style="width: 100%">
	    <el-table-column
	      prop="code"
	      label="注册码"
	      width="180">
	    </el-table-column>
	    <el-table-column
	      prop="source"
	      label="归属人"
	      width="180">
	    </el-table-column>
	    <el-table-column
	      prop="usedCount"
	      label="已注册人数"
	      width="180">
	    </el-table-column>
	    <el-table-column
	      prop="createTime"
	      label="生成注册码时间"
	      width="180">
	    </el-table-column>
	    <el-table-column
	      prop="createName"
	      label="操作人">
	    </el-table-column>
	  </el-table>
	  <div style="display: flex;justify-content: center;padding: 30px 0;">
	  </div>
		<el-dialog
		  :title="title"
		  :visible.sync="flag"
		  width="400px"
		  >
		  <el-form :model="addForm" ref="addForm" label-width="10px">
			  <el-form-item
			    label=""
			    prop="source"
			    :rules="[
			      { required: true, message: '该项必填'},
			    ]"
			  >
			    <el-input maxlength="10" v-model="addForm.source" placeholder="请备注注册码归属人名称（10个字以内）"></el-input>
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
  createCode,
  findAllCode,
} from '@/api/configManager.js'
export default {
  name: 'registration-code',
  components: {
  },
  data() {
    return {
    	flag: false,
    	title: '新增',
    	list: [],
    	addForm: {
    		source: '',
    	},
    }
  },
  created() {
  	this.findAllCode();
  },
  mounted() {
  },
  methods: {
		submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.createCode();
        } else {
          console.log('error submit!!');
          return false;
        }
      });
    },
    show(formName) {
      this.flag = true;
			this.addForm = {
    		source: '',
    	}
    },
		createCode() {
      createCode(this.addForm).then(res => {
        if (res.success) {
        	this.$message({
            type: 'success',
            message: '新增成功!'
          });
					this.flag = false;
          this.findAllCode();
        }else {
					this.$message({
            type: 'error',
            message: '新增失败!'
          });
        }
      }).catch(err => {

      })
    },
    findAllCode() {
      findAllCode({}).then(res => {
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
.table-list {
  &-container {
    border-top: 1px solid #EBEEF5;
    border-left: 1px solid #EBEEF5;
    border-right: 1px solid #EBEEF5;
    ::v-deep {
      .el-table__header th {
        color: #1f2d3d;
        background-color: #f8f8f9;
      }
    }
  }
}
</style>