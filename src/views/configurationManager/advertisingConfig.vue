<template>
  <div class="app-container user-authorize">
  	<div>
  		请选择广告区域位置
  	</div>
  	<div style="display: flex;justify-content: space-between;padding: 10px 0;">
  		<div>
  		</div>
  		<div><el-button @click="addShow()" type="primary" icon="el-icon-plus">新增</el-button></div>
  	</div>
			<el-tabs v-model="activeName" type="card" @tab-click="handleClick">
		    <el-tab-pane label="伴伴" name="PERSON_SHOW">
					<el-table
				    :data="tableData"
				    class="table-list-container"
				    style="width: 100%">
				    <el-table-column
				      prop="sortNo"
				      label="排序"
				      width="180">
				    </el-table-column>
				    <el-table-column
				      prop="adName"
				      label="名称"
				      width="180">
				    </el-table-column>
				    <el-table-column
				      prop="adPicUrl"
				      width="210"
				      label="图片">
							<template slot-scope="scope">
				        <img :src="scope.row.adPicUrl" style="width: 200px;height:100px;" />
				      </template>
				    </el-table-column>
				    <el-table-column
				      prop="status"
				      label="状态">
							<template slot-scope="scope">
				        {{scope.row.status == 0 ? '待生效状态' : scope.row.status == 1 ? '生效中状态' :'已下架状态'}}
				      </template>
				    </el-table-column>
				    <el-table-column
				      prop="adActiveTime"
				      label="生效时间">
				    </el-table-column>
				    <el-table-column
				      prop="adExpireTime"
				      label="过期时间">
				    </el-table-column>
				    <el-table-column
				      prop="address"
				      label="操作">
				      <template slot-scope="scope">
				        <el-button  style="color:#F56C6C;" v-if="scope.row.status == 1" @click="offLine(scope.row.adId)" type="text" size="small">下架</el-button>
				        <el-button v-else @click="editShow(scope.$index)" type="text" size="small">编辑</el-button>
				      </template>
				    </el-table-column>
				  </el-table>
		    </el-tab-pane>
		    <el-tab-pane label="发现" name="DYNAMIC">
					<el-table
				    :data="tableData"
				    class="table-list-container"
				    style="width: 100%">
				    <el-table-column
				      prop="sortNo"
				      label="排序"
				      width="180">
				    </el-table-column>
				    <el-table-column
				      prop="adName"
				      label="名称"
				      width="180">
				    </el-table-column>
				    <el-table-column
				      prop="adPicUrl"
				      width="210"
				      label="图片">
							<template slot-scope="scope">
				        <img :src="scope.row.adPicUrl" style="width: 200px;height:100px;" />
				      </template>
				    </el-table-column>
				    <el-table-column
				      prop="status"
				      label="状态">
							<template slot-scope="scope">
				        {{scope.row.status == 0 ? '待生效状态' : scope.row.status == 1 ? '生效中状态' :'已下架状态'}}
				      </template>
				    </el-table-column>
				    <el-table-column
				      prop="adActiveTime"
				      label="生效时间">
				    </el-table-column>
				    <el-table-column
				      prop="adExpireTime"
				      label="过期时间">
				    </el-table-column>
				    <el-table-column
				      prop="address"
				      label="操作">
				      <template slot-scope="scope">
				        <el-button style="color:#F56C6C;" v-if="scope.row.status == 1" @click="offLine(scope.row.adId)" type="text" size="small">下架</el-button>
				        <el-button v-else @click="editShow(scope.$index)" type="text" size="small">编辑</el-button>
				      </template>
				    </el-table-column>
				  </el-table>
		    </el-tab-pane>
		  </el-tabs>
	  <div style="display: flex;justify-content: center;padding: 30px 0;">
		  <!-- <el-pagination
	      @size-change="handleSizeChange"
	      @current-change="handleCurrentChange"
	      :current-page="currentPage4"
	      :page-sizes="[100, 200, 300, 400]"
	      :page-size="100"
	      layout="total, sizes, prev, pager, next, jumper"
	      :total="400">
	    </el-pagination> -->
	  </div>
	  <el-dialog
		  :title="title"
		  :visible.sync="flag"
		  width="50%"
		  >
		  <el-form :model="ruleForm" status-icon :rules="rules" ref="advertisingForm" label-width="100px">
			  <el-form-item label=" 广告名称" prop="adName">
			    <el-input v-model="ruleForm.adName" placeholder="请输入广告名称"></el-input>
			  </el-form-item>
			  <el-form-item label="跳转链接" prop="jumpUrl">
			    <el-input v-model="ruleForm.jumpUrl" placeholder="请输入跳转链接"></el-input>
			  </el-form-item>
				<el-row>
          <el-col :span="24">
            <el-form-item label="图片" prop="adPicUrl">
              <sa-upload v-model="ruleForm.adPicUrl" accept="image/png, image/jpg, image/jpeg" style="width: 100px; height: 100px;" :size="5">
                <p slot="tip">宽高比：620*984，支持PNG、JPEG、JPG格式，大小5M以内</p>
              </sa-upload>
            </el-form-item>
          </el-col>
          </el-row>
			  <el-form-item label="排序" prop="sortNo">
			    <el-input v-model.number="ruleForm.sortNo" placeholder="请设置序号"></el-input>
			  </el-form-item>
			  <el-form-item label="起止时间" prop="time">
			    <el-date-picker
			    	@change="change"
			      v-model="ruleForm.time"
			      type="datetimerange"
			      format="yyyy-MM-dd HH:mm:ss"
			      value-format="yyyy-MM-dd HH:mm:ss"
			      range-separator="至"
			      start-placeholder="开始日期"
			      end-placeholder="结束日期">
			    </el-date-picker>
			  </el-form-item>
			</el-form>
		  <span slot="footer" class="dialog-footer">
		    <el-button @click="resetForm('advertisingForm')">取 消</el-button>
		    <el-button type="primary" @click="submitForm('advertisingForm')">确 定</el-button>
		  </span>
		</el-dialog>
  </div>
</template>

<script>

import API from '@/api/user-manager'
import { fixOssPre } from '@/utils'
import validate from '@/utils/validate.js'
import TablePageMixin from '@/mixins/table-page'
import saUpload from '@/components/UploadCloud'
import {
  list,
  add,
  edit,
  offLine,
} from '@/api/configManager.js'
export default {
  name: 'advertisingConfig',
  components: {
  	saUpload
  },
  mixins: [TablePageMixin],
  data() {
    return {
    	title: '新增个人秀广告',
    	activeName: 'PERSON_SHOW',
    	ruleForm: {
        adId: '',
        operatorUid: '',
        adName: '',
        jumpUrl: '',
        adPicUrl: '',
        sortNo: '',
        time: [],
        adActiveTime: '',
        adExpireTime: '',
        sceneType: '',
      },
      rules: {
        adName: [
          { required: true,message: '该项必填', trigger: 'blur' },
        ],
        jumpUrl: [
          { required: true,message: '该项必填', trigger: 'blur' },
          validate.link
        ],
        sortNo: [
          {required: true,message: '该项必填', trigger: 'blur' }
        ],
        adPicUrl: [
          {required: true,message: '该项必填', trigger: 'blur' },
        ],
        time: [
          {required: true,message: '该项必填', trigger: 'blur' }
        ],

      },
    	flag:false,
    	currentPage4:1,
    	tableData: [],
    }
  },
  created() {
    this.list();
  },
  methods: {
		submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          switch (this.title) {
          	case '新增个人秀广告':
          		this.add();
          		break;
          	case '新增广场秀广告':
          		this.add();
          		break;
          	case '编辑广场秀广告':
          		this.edit();
          		break;
          	case '编辑个人秀广告':
          		this.edit();
          		break;
          }
        } else {
          console.log('error submit!!');
          return false;
        }
      });
    },
    resetForm(formName) {
    	this.flag=false;
      this.$refs[formName].resetFields();
    },
    change(formName) {
    	console.log(formName,4444)
    },
  	list(tab, event) {
      list({adSceneType:this.activeName}).then(res => {
        if (res.success) {
					this.tableData=res.data;
        }else {
        }
      }).catch(err => {

      })
    },
    addShow() {
			this.flag = true;
			this.ruleForm = {
        adId: '',
        operatorUid: '',
        adName: '',
        jumpUrl: '',
        adPicUrl: '',
        sortNo: '',
        time: [],
        adActiveTime: '',
        adExpireTime: '',
        sceneType: this.activeName,
      }
      if (this.activeName == 'PERSON_SHOW') {
      	this.title = '新增个人秀广告'
      }else {
      	this.title = '新增广场秀广告'
      }
    },
    editShow(i) {
			if (this.activeName == 'PERSON_SHOW') {
      	this.title = '编辑个人秀广告'
      }else {
      	this.title = '编辑广场秀广告'
      }
			this.flag = true;
			// this.tableData[i].time = [this.tableData[i].adActiveTime,this.tableData[i].adExpireTime];
			// this.ruleForm = this.tableData[i];
			this.ruleForm.time = [this.tableData[i].adActiveTime,this.tableData[i].adExpireTime];
			Object.keys(this.tableData[i]).forEach(item => {
				this.ruleForm[item] = this.tableData[i][item];
			})
			console.log(this.ruleForm,'this.ruleForm')
    },
    add(tab, event) {
    	this.ruleForm.adActiveTime = this.ruleForm.time[0];
    	this.ruleForm.adExpireTime = this.ruleForm.time[1];
      add(Object.assign(this.ruleForm,{adPicUrl: fixOssPre(this.ruleForm.adPicUrl)})).then(res => {
        if (res.success) {
        	this.$message({
            type: 'success',
            message: '新增成功!'
          });
					this.flag=false;
          this.list();
        }else {
					this.$message({
            type: 'error',
            message: '新增失败!'
          });
        }
      }).catch(err => {

      })
    },
    edit(tab, event) {
    	console.log(this.ruleForm,'this.ruleForm')
			this.ruleForm.adActiveTime = this.ruleForm.time[0];
    	this.ruleForm.adExpireTime = this.ruleForm.time[1];
      edit(Object.assign(this.ruleForm,{adPicUrl: fixOssPre(this.ruleForm.adPicUrl)})).then(res => {
        if (res.success) {
        	this.$message({
            type: 'success',
            message: '编辑成功!'
          });
					this.flag=false;
          this.list();
        }else {
					this.$message({
            type: 'error',
            message: '编辑失败!'
          });
        }
      }).catch(err => {

      })
    },
    offLine(id) {
			this.$confirm('确定下架该广告图吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
				offLine({adId: id}).then(res => {
	        if (res.success) {
	        	this.$message({
	            type: 'success',
	            message: '下架成功!'
	          });
	          this.list();
	        }else {
						this.$message({
	            type: 'error',
	            message: '下架失败!'
	          });
	        }
	      }).catch(err => {

	      })
      })
    },
    handleClick(tab, event) {
    	this.list();
    },
    handleSizeChange(uid) {
    },
    handleCurrentChange(uid) {
    },
    handleClose(uid) {
    },

  }
}
</script>
<style scoped lang="scss">
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
