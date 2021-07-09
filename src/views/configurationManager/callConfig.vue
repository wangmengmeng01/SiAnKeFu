<template>
  <div class="app-container user-authorize">
			<el-tabs v-model="activeName" type="card" @tab-click="handleClick">
		    <el-tab-pane label="语音通话价格配置" name="voice">
		    	<el-button @click="voiceAdd('新增语音')" type="primary" icon="el-icon-plus">新增</el-button>
					<el-table
				    :data="voiceData"
				    class="table-list-container"
				    style="width: 100%;margin-top: 20px;">
				    <el-table-column
				      prop="sortNo"
				      label="排序"
				      width="180">
				    </el-table-column>
				    <el-table-column
				      prop="type"
				      label="类型"
				      width="180">
				    </el-table-column>
				    <el-table-column
				      prop="originalPrice"
				      label="通用价格（钻石/分钟）">
				    </el-table-column>
				    <el-table-column
				      prop="discountPrice"
				      label="VIP价格（钻石/分钟）">
				    </el-table-column>
				    <el-table-column
				      prop="address"
				      label="操作">
				      <template slot-scope="scope">
				        <el-button @click="edit(scope.$index,'编辑语音')" type="text" size="small">编辑</el-button>
				        <el-button @click="del(scope.row.id)" style="color:#F56C6C;" type="text" size="small">删除</el-button>
				      </template>
				    </el-table-column>
				  </el-table>
		    </el-tab-pane>
		    <el-tab-pane label="视频通话价格配置" name="video">
		    	<el-button @click="voiceAdd('新增视频')"  type="primary" icon="el-icon-plus">新增</el-button>
					<el-table
				    :data="videoData"
				    class="table-list-container"
				    style="width: 100%;margin-top: 20px;">
				    <el-table-column
				      prop="sortNo"
				      label="排序"
				      width="180">
				    </el-table-column>
				    <el-table-column
				      prop="type"
				      label="类型"
				      width="180">
				    </el-table-column>
				    <el-table-column
				      prop="originalPrice"
				      label="通用价格（钻石/分钟）">
				    </el-table-column>
				    <el-table-column
				      prop="discountPrice"
				      label="VIP价格（钻石/分钟）">
				    </el-table-column>
				    <el-table-column
				      prop="address"
				      label="操作">
				      <template slot-scope="scope">
				        <el-button @click="edit(scope.$index,'编辑视频')" type="text" size="small">编辑</el-button>
				        <el-button @click="del(scope.row.id)" style="color:#F56C6C;" type="text" size="small">删除</el-button>
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
		  <el-form :model="voiceForm" status-icon :rules="rules" ref="voiceForm" label-width="100px" class="demo-voiceForm">
			  <el-form-item label=" 通用价格" prop="originalPrice">
			    <el-input v-model.number="voiceForm.originalPrice" placeholder="请输入一个正整数"></el-input>
			  </el-form-item>
			  <el-form-item label="VIP价格" prop="discountPrice">
			    <el-input v-model.number="voiceForm.discountPrice" placeholder="请输入一个正整数"></el-input>
			  </el-form-item>
			  <el-form-item label="序号" prop="sortNo">
			    <el-input v-model.number="voiceForm.sortNo" placeholder="请设置排序"></el-input>
			  </el-form-item>
			</el-form>
		  <span slot="footer" class="dialog-footer">
		    <el-button @click="resetForm('voiceForm')">取 消</el-button>
		    <el-button type="primary" @click="submitForm('voiceForm')">确 定</el-button>
		  </span>
		</el-dialog>
  </div>
</template>

<script>

import API from '@/api/user-manager'
import TablePageMixin from '@/mixins/table-page'
import {
  voiceCallPriceList,
  voiceCallPriceAdd,
  voiceCallPriceEdit,
  videoCallPriceList,
  videoCallPriceAdd,
  videoCallPriceEdit,
  voiceCallPriceDel,
  videoCallPriceDel,
} from '@/api/configManager.js'
export default {
  name: 'callConfig',
  components: {
  },
  mixins: [TablePageMixin],
  data() {
  	var validatePass2 = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请再次输入密码'));
        } else if (value !== this.ruleForm.pass) {
          callback(new Error('两次输入密码不一致!'));
        } else {
          callback();
        }
      };
    return {
    	activeName: 'voice',
    	title: '新增语音',
    	voiceForm: {
        originalPrice: '',
        discountPrice: '',
        sortNo: ''
      },
      rules: {
        originalPrice: [
          { required: true,message: '该项必填', trigger: 'blur' },
          { type:'number',min: 1, message: '请输入一个正整数', trigger: 'blur' }
        ],
        discountPrice: [
          { required: true,message: '该项必填', trigger: 'blur' },
          { type:'number', min: 1, message: '请输入一个正整数', trigger: 'blur' }
        ],
        sortNo: [
          { type:'number',required: true,message: '该项必填', trigger: 'blur' }
        ]
      },
    	flag:false,
    	currentPage4:1,
    	voiceData: [],
    	videoData: [],
    }
  },
  beforeCreate() {
    this.$api = API[this.$route.path]
  },
  created() {
  	this.voiceCallPriceList();
  	this.videoCallPriceList();
  },
  methods: {
  	submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          switch (this.title) {
          	case '编辑语音':
          		this.voiceCallPriceEdit();
          		break;
          	case '编辑视频':
          		this.videoCallPriceEdit();
          		break;
          	case '新增语音':
          		this.voiceCallPriceAdd();
          		break;
          	case '新增视频':
          		this.videoCallPriceAdd();
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
  	voiceCallPriceList() {
      voiceCallPriceList().then(res => {
        if (res.success) {
        	res.data.forEach(item => {
        		item.type = '音频通话';
        	})
          this.voiceData = res.data;
        }
      }).catch(err => {

      })
    },
    edit(i,t) {
    	this.title=t;
    	if(this.title == '编辑语音') {
	    	this.voiceForm=this.voiceData[i];
    	}else {
    		this.voiceForm=this.videoData[i];
    	}
    	this.flag=true;
    },
    voiceAdd(i) {
    	this.title=i;
    	this.flag=true;
    	this.voiceForm={
        originalPrice: '',
        discountPrice: '',
        sortNo: ''
      };
    },
    del(id) {
    	this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
        	if (this.activeName == "voice") {
						voiceCallPriceDel({id}).then(res => {
			        if (res.success) {
			        	this.$message({
			            type: 'success',
			            message: '删除成功!'
			          });
			          this.voiceCallPriceList();
			        }else {
								this.$message({
			            type: 'error',
			            message: '删除失败!'
			          });
			        }
			      }).catch(err => {

			      })
        	}else {
			      videoCallPriceDel({id}).then(res => {
			        if (res.success) {
			        	this.$message({
			            type: 'success',
			            message: '删除成功!'
			          });
			          this.videoCallPriceList();
			        }else {
								this.$message({
			            type: 'error',
			            message: '删除失败!'
			          });
			        }
			      }).catch(err => {

			      })
        	}
        })

    },
    voiceCallPriceAdd(tab, event) {
      voiceCallPriceAdd(this.voiceForm).then(res => {
        if (res.success) {
        	this.$message({
            type: 'success',
            message: '新增成功!'
          });
          this.flag=false;
          this.voiceCallPriceList();
        }else {
					this.$message({
            type: 'error',
            message: '新增失败!'
          });
        }
      }).catch(err => {

      })
    },
    voiceCallPriceEdit(tab, event) {
      voiceCallPriceEdit(this.voiceForm).then(res => {
        if (res.success) {
        	this.$message({
            type: 'success',
            message: '编辑成功!'
          });
					this.flag=false;
          this.voiceCallPriceList();
        }else {
					this.$message({
            type: 'error',
            message: '编辑失败!'
          });
        }
      }).catch(err => {

      })
    },
    videoCallPriceList(tab, event) {
      videoCallPriceList().then(res => {
        if (res.success) {
        	res.data.forEach(item => {
        		item.type = '视频通话';
        	})
          this.videoData = res.data;
        }
      }).catch(err => {

      })
    },
    videoCallPriceAdd(tab, event) {
      videoCallPriceAdd(this.voiceForm).then(res => {
        if (res.success) {
        	this.$message({
            type: 'success',
            message: '编辑成功!'
          });
					this.flag=false;
          this.videoCallPriceList();
        }else {
					this.$message({
            type: 'error',
            message: '编辑失败!'
          });
        }
      }).catch(err => {

      })
    },
    videoCallPriceEdit(tab, event) {
      videoCallPriceEdit(this.voiceForm).then(res => {
        if (res.success) {
        	this.$message({
            type: 'success',
            message: '编辑成功!'
          });
					this.flag=false;
          this.videoCallPriceList();
        }else {
					this.$message({
            type: 'error',
            message: '编辑失败!'
          });
        }
      }).catch(err => {

      })
    },
    handleClick(tab, event) {
    	this.activeName = tab.name;
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
