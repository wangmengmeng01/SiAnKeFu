<template>
  <div class="app-container user-authorize">
  	<div style="display: flex;justify-content: space-between;padding: 10px 0;">
  		<div>
  		</div>
  		<div><el-button @click="addShow()" type="primary" icon="el-icon-plus">新增</el-button></div>
  	</div>
		<el-table
	    :data="tableData"
	    class="table-list-container"
	    style="width: 100%">
	    <el-table-column
	      prop="csCategoryName"
	      label="类别名称"
	      width="180">
	    </el-table-column>
	    <el-table-column
	      prop="createByName"
	      label="创建人"
	      width="180">
	    </el-table-column>
	    <el-table-column
	      prop="createTime"
	      width="210"
	      label="创建时间">
	    </el-table-column>
	    <el-table-column
	      prop="active"
	      label="状态">
				<template slot-scope="scope">
	        {{scope.row.active == 0 ? '启用' : '禁用'}}
	      </template>
	    </el-table-column>
	    <el-table-column
	      prop="address"
	      label="操作">
	      <template slot-scope="scope">
	        <el-button  style="color:#F56C6C;" @click="editShow(scope.$index)" type="text" size="small">编辑</el-button>
	        <el-button @click="defaultShow(scope.row.csCategoryId)" type="text" size="small">设置默认消息</el-button>
	        <el-button @click="messageShow(scope.row.csCategoryId)" type="text" size="small">新增消息</el-button>
	      </template>
	    </el-table-column>
	  </el-table>
	  <el-dialog
		  :title="title"
		  :visible.sync="flag"
		  width="50%"
		  >
		  <el-form :model="categoryForm" status-icon :rules="rules" ref="advertisingForm" label-width="100px">
			  <el-form-item label=" 类别名称" prop="name">
			    <el-input maxlength="10" v-model="categoryForm.name" placeholder="请输入类别名称"></el-input>
			  </el-form-item>
			  <el-form-item label="是否启用" prop="active">
			  	<el-select v-model="categoryForm.active" placeholder="请选择">
				    <el-option
				      v-for="item in [{label: '启用', value: 0},{label: '禁用', value: 1},]"
				      :key="item.value"
				      :label="item.label"
				      :value="item.value">
				    </el-option>
				  </el-select>
			  </el-form-item>
			</el-form>
		  <span slot="footer" class="dialog-footer">
		    <el-button @click="resetForm('advertisingForm')">取 消</el-button>
		    <el-button type="primary" @click="submitForm('advertisingForm')">确 定</el-button>
		  </span>
		</el-dialog>
		<el-dialog
		  :title="title"
		  :visible.sync="messageFlag"
		  width="50%"
		  >
		  <el-form :model="addForm" status-icon :rules="rules" ref="messageForm" label-width="100px">
			  <el-form-item label=" 消息类型" prop="messageType">
			  	<el-radio-group v-model="addForm.messageType" size="small">
			      <el-radio label="2" border>图文链接</el-radio>
			      <el-radio label="1" border>图文内容</el-radio>
			    </el-radio-group>
			  </el-form-item>
			  <el-form-item label="消息标题" prop="title">
			    <el-input maxlength="10" v-model="addForm.title" placeholder="请输入消息标题，10个字以内"></el-input>
			  </el-form-item>
			  <el-form-item label="消息简介" prop="content">
			    <el-input type="textarea" maxlength="30" v-model="addForm.content" placeholder="请输入消息简介，30个字以内"></el-input>
			  </el-form-item>
			  <el-form-item label="跳转链接" prop="redirectUrl">
			    <el-input v-model="addForm.redirectUrl" placeholder="请输入跳转链接"></el-input>
			  </el-form-item>
				<el-row>
          <el-col :span="24">
            <el-form-item label="封面图" prop="cover">
              <sa-upload v-model="addForm.cover" accept="image/png, image/jpg, image/jpeg" style="width: 100px; height: 100px;" :size="5">
                <p slot="tip">支持PNG、JPEG、JPG格式，大小5M以内</p>
              </sa-upload>
            </el-form-item>
          </el-col>
          </el-row>
			</el-form>
		  <span slot="footer" class="dialog-footer">
		    <el-button @click="resetForm('messageForm')">取 消</el-button>
		    <el-button type="primary" @click="submitForm('messageForm')">确 定</el-button>
		  </span>
		</el-dialog>
		<el-dialog
		  :title="title"
		  :visible.sync="defaultFlag"
		  width="50%"
		  >
		  <el-tabs value="1" tab-position="left" @tab-click="tabClick">
		    <el-tab-pane name="1" label="消息1">
					<el-form :model="addForm" status-icon :rules="rules" ref="default1Form" label-width="100px">
					  <el-form-item label="消息类型" prop="messageType">
					  	<el-radio-group @change="clearValidate('default1Form')" v-model="addForm.messageType" size="small">
					      <el-radio :label="2" border>图文链接</el-radio>
					      <el-radio :label="1" border>图文内容</el-radio>
					    </el-radio-group>
					  </el-form-item>
					  <div v-if="addForm.messageType == 2">
						  <el-form-item label="消息标题" prop="title">
						    <el-input maxlength="10" v-model="addForm.title" placeholder="请输入消息标题，10个字以内"></el-input>
						  </el-form-item>
						  <el-form-item label="消息简介" prop="content">
						    <el-input type="textarea" maxlength="30" v-model="addForm.content" placeholder="请输入消息简介，30个字以内"></el-input>
						  </el-form-item>
						  <el-form-item label="跳转链接" prop="redirectUrl">
						    <el-input v-model="addForm.redirectUrl" placeholder="请输入跳转链接"></el-input>
						  </el-form-item>
							<el-row>
			          <el-col :span="24">
			            <el-form-item label="封面图" prop="cover">
			              <sa-upload v-model="addForm.cover" accept="image/png, image/jpg, image/jpeg" style="width: 100px; height: 100px;" :size="5">
			                <p slot="tip">支持PNG、JPEG、JPG格式，大小5M以内</p>
			              </sa-upload>
			            </el-form-item>
			          </el-col>
		          </el-row>
					  </div>
					  <div v-else>
						  <el-form-item label="内容类型" prop="contentType">
								<el-radio-group @change="addForm.content = '',clearValidate('default1Form')" v-model="addForm.contentType" size="small">
						      <el-radio :label="1" border>文字</el-radio>
						      <el-radio :label="2" border>图片</el-radio>
						    </el-radio-group>
						  </el-form-item>
						  <el-form-item v-if="addForm.contentType == 1" label="消息内容" prop="content">
						    <el-input type="textarea" maxlength="30" v-model="addForm.content" placeholder="请输入消息简介，30个字以内"></el-input>
						  </el-form-item>
							<el-form-item v-else label="消息内容" prop="content">
	              <sa-upload v-model="addForm.content" accept="image/png, image/jpg, image/jpeg" style="width: 100px; height: 100px;" :size="5">
	                <p slot="tip">支持PNG、JPEG、JPG格式，大小5M以内</p>
	              </sa-upload>
	            </el-form-item>
					  </div>
	          <el-form-item>
					    <el-button v-show="addForm.delFlag" type="danger" @click="showDel()">删除</el-button>
					    <el-button v-show="!addForm.delFlag" @click="resetForm('default1Form')">取 消</el-button>
		    			<el-button type="primary" @click="submitForm('default1Form')">确 定</el-button>
					  </el-form-item>
					</el-form>
		    </el-tab-pane>
		    <el-tab-pane name="2" label="消息2">
					<el-form :model="addForm" status-icon :rules="rules" ref="default2Form" label-width="100px">
					  <el-form-item label=" 消息类型" prop="messageType">
					  	<el-radio-group @change="clearValidate('default2Form')" v-model="addForm.messageType" size="small">
					      <el-radio :label="2" border>图文链接</el-radio>
					      <el-radio :label="1" border>图文内容</el-radio>
					    </el-radio-group>
					  </el-form-item>
					  <div v-if="addForm.messageType == 2">
						  <el-form-item label="消息标题" prop="title">
						    <el-input maxlength="10" v-model="addForm.title" placeholder="请输入消息标题，10个字以内"></el-input>
						  </el-form-item>
						  <el-form-item label="消息简介" prop="content">
						    <el-input type="textarea" maxlength="30" v-model="addForm.content" placeholder="请输入消息简介，30个字以内"></el-input>
						  </el-form-item>
						  <el-form-item label="跳转链接" prop="redirectUrl">
						    <el-input v-model="addForm.redirectUrl" placeholder="请输入跳转链接"></el-input>
						  </el-form-item>
							<el-row>
			          <el-col :span="24">
			            <el-form-item label="封面图" prop="cover">
			              <sa-upload v-model="addForm.cover" accept="image/png, image/jpg, image/jpeg" style="width: 100px; height: 100px;" :size="5">
			                <p slot="tip">支持PNG、JPEG、JPG格式，大小5M以内</p>
			              </sa-upload>
			            </el-form-item>
			          </el-col>
		          </el-row>
					  </div>
					  <div v-else>
						  <el-form-item label="内容类型" prop="contentType">
								<el-radio-group @change="addForm.content = '',clearValidate('default2Form')" v-model="addForm.contentType" size="small">
						      <el-radio :label="1" border>文字</el-radio>
						      <el-radio :label="2" border>图片</el-radio>
						    </el-radio-group>
						  </el-form-item>
						  <el-form-item v-if="addForm.contentType == 1" label="消息内容" prop="content">
						    <el-input type="textarea" maxlength="30" v-model="addForm.content" placeholder="请输入消息简介，30个字以内"></el-input>
						  </el-form-item>
							<el-form-item v-else label="消息内容" prop="content">
	              <sa-upload v-model="addForm.content" accept="image/png, image/jpg, image/jpeg" style="width: 100px; height: 100px;" :size="5">
	                <p slot="tip">支持PNG、JPEG、JPG格式，大小5M以内</p>
	              </sa-upload>
	            </el-form-item>
					  </div>
	          <el-form-item>
					    <el-button v-show="addForm.delFlag" type="danger" @click="showDel()">删除</el-button>
					    <el-button v-show="!addForm.delFlag" @click="resetForm('default2Form')">取 消</el-button>
		    			<el-button type="primary" @click="submitForm('default2Form')">确 定</el-button>
					  </el-form-item>
					</el-form>
		    </el-tab-pane>
		    <el-tab-pane name="3" label="消息3">
					<el-form :model="addForm" status-icon :rules="rules" ref="default3Form" label-width="100px">
					  <el-form-item label=" 消息类型" prop="messageType">
					  	<el-radio-group @change="clearValidate('default3Form')" v-model="addForm.messageType" size="small">
					      <el-radio :label="2" border>图文链接</el-radio>
					      <el-radio :label="1" border>图文内容</el-radio>
					    </el-radio-group>
					  </el-form-item>
					  <div v-if="addForm.messageType == 2">
						  <el-form-item label="消息标题" prop="title">
						    <el-input maxlength="10" v-model="addForm.title" placeholder="请输入消息标题，10个字以内"></el-input>
						  </el-form-item>
						  <el-form-item label="消息简介" prop="content">
						    <el-input type="textarea" maxlength="30" v-model="addForm.content" placeholder="请输入消息简介，30个字以内"></el-input>
						  </el-form-item>
						  <el-form-item label="跳转链接" prop="redirectUrl">
						    <el-input v-model="addForm.redirectUrl" placeholder="请输入跳转链接"></el-input>
						  </el-form-item>
							<el-row>
			          <el-col :span="24">
			            <el-form-item label="封面图" prop="cover">
			              <sa-upload v-model="addForm.cover" accept="image/png, image/jpg, image/jpeg" style="width: 100px; height: 100px;" :size="5">
			                <p slot="tip">支持PNG、JPEG、JPG格式，大小5M以内</p>
			              </sa-upload>
			            </el-form-item>
			          </el-col>
		          </el-row>
					  </div>
					  <div v-else>
						  <el-form-item label="内容类型" prop="contentType">
								<el-radio-group @change="addForm.content = '',clearValidate('default3Form')" v-model="addForm.contentType" size="small">
						      <el-radio :label="1" border>文字</el-radio>
						      <el-radio :label="2" border>图片</el-radio>
						    </el-radio-group>
						  </el-form-item>
						  <el-form-item v-if="addForm.contentType == 1" label="消息内容" prop="content">
						    <el-input type="textarea" maxlength="30" v-model="addForm.content" placeholder="请输入消息简介，30个字以内"></el-input>
						  </el-form-item>
							<el-form-item v-else label="消息内容" prop="content">
	              <sa-upload v-model="addForm.content" accept="image/png, image/jpg, image/jpeg" style="width: 100px; height: 100px;" :size="5">
	                <p slot="tip">支持PNG、JPEG、JPG格式，大小5M以内</p>
	              </sa-upload>
	            </el-form-item>
					  </div>
	          <el-form-item>
					    <el-button v-show="addForm.delFlag" type="danger" @click="showDel()">删除</el-button>
					    <el-button v-show="!addForm.delFlag" @click="resetForm('default3Form')">取 消</el-button>
		    			<el-button type="primary" @click="submitForm('default3Form')">确 定</el-button>
					  </el-form-item>
					</el-form>
		    </el-tab-pane>
		  </el-tabs>
		</el-dialog>
  </div>
</template>

<script>

import API from '@/api/user-manager'
import { fixOssPre } from '@/utils'
import validate from '@/utils/validate'
import TablePageMixin from '@/mixins/table-page'
import saUpload from '@/components/UploadCloud'
import {
  findByPage,
  findEffective,
  create,
  edit,
  defaultAdd,
  defaultEdit,
  pushMessageToAppUserByCsCategory,
  del,
  messageDetail,
} from '@/api/customerManagement.js'
export default {
  name: 'categorySettings',
  components: {
  	saUpload
  },
  mixins: [TablePageMixin],
  data() {
    return {
    	title: '设置默认消息（仅针对新用户首次进入App时 push用）',
    	activeName: 'PERSON_SHOW',
    	csCategoryId: '',
    	message: [],
    	categoryForm: {
        name: '',
        active: 0,
      },
      addForm: {
        csCategoryId: '',
        messageType: '',
        contentType: '',
        title: '',
        content: '',
        redirectUrl: '',
        cover: '',
      },
      rules: {
        name: [
          { required: true,message: '该项必填', trigger: 'blur' },
        ],
        messageType: [
          { required: true,message: '该项必填', trigger: 'blur' },
        ],
        title: [
          { required: true,message: '该项必填', trigger: 'blur' },
        ],
        content: [
          {required: true,message: '该项必填', trigger: 'blur' }
        ],
        redirectUrl: [
          {required: true,message: '该项必填', trigger: 'blur' },
          validate.link
        ],
        cover: [
          {required: false,message: '该项必填', trigger: 'blur' }
        ],
        contentType: [
          {required: true,message: '该项必填', trigger: 'blur' }
        ],

      },
    	flag:false,
    	messageFlag:false,
    	defaultFlag:false,
    	currentPage4:1,
    	tableData: [],
    	tabFlag: '1',
    }
  },
  created() {
    this.findByPage();
  },
  methods: {
		submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          switch (this.title) {
          	case '新增类别':
          		this.create();
          		break;
          	case '编辑类别':
          		this.edit();
          		break;
          	case '新增消息（针对于目前已注册的老用户Push消息）':
          		this.pushMessageToAppUserByCsCategory();
          		break;
          	case '设置默认消息（仅针对新用户首次进入App时 push用）':
          		this.defaultAdd();
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
    	this.defaultFlag=false;
    	this.messageFlag=false;
      this.$refs[formName].resetFields();
      this.$refs[formName].clearValidate();
    },
    clearValidate(formName) {
      this.$refs[formName].clearValidate();
    },
    tabClick(tab) {
    	this.tabFlag = tab.name;
    	this.messageDetail();
    },
  	findByPage(tab, event) {
      findByPage({}).then(res => {
        if (res.success) {
					this.tableData=res.data.list;
        }else {
        }
      }).catch(err => {

      })
    },
    del() {
      del({templateId: this.tabFlag,csCategoryId: this.csCategoryId}).then(res => {
        if (res.success) {
					this.$message({
            type: 'success',
            message: '删除成功!'
          });
					this.addForm.delFlag = false;
					this.addForm = {
					  csCategoryId: this.csCategoryId,
					  messageType: 1,
					  templateNumber: this.tabFlag,
					  contentType: 1,
					  title: '',
					  content: '',
					  redirectUrl: '',
					  cover: '',
					}
        }else {
					this.$message({
            type: 'error',
            message: '删除成功!'
          });
        }
      }).catch(err => {

      })
    },
    messageDetail() {
      messageDetail({csCategoryId:this.csCategoryId,templateNumber:this.tabFlag}).then(res => {
        if (res.success) {
					if (res.data == null) {
						this.addForm = {
						  csCategoryId: this.csCategoryId,
						  messageType: 2,
						  templateNumber: this.tabFlag,
						  contentType: 1,
						  title: '',
						  content: '',
						  redirectUrl: '',
						  cover: '',
						}
					}else {
						this.addForm=res.data;
						this.addForm.delFlag = true;
					}
        }
      }).catch(err => {
				this.addForm = {
				  csCategoryId: this.csCategoryId,
				  messageType: 2,
				  templateNumber: this.tabFlag,
				  contentType: 1,
				  title: '',
				  content: '',
				  redirectUrl: '',
				  cover: '',
				}
			})
    },
    addShow() {
			this.flag = true;
			this.categoryForm = {
        name: '',
        active: 0,
      }
    	this.title = '新增类别';
    },
    messageShow(id) {
			this.messageFlag = true;
			this.addForm = {
        csCategoryId: '',
        messageType: '2',
        contentType: '',
        title: '',
        content: '',
        redirectUrl: '',
        cover: '',
      }
    	this.title = '新增消息（针对于目前已注册的老用户Push消息）';
    },
    defaultShow(csCategoryId) {
			this.csCategoryId = csCategoryId;
    	this.messageDetail();
			this.defaultFlag = true;
    	this.title = '设置默认消息（仅针对新用户首次进入App时 push用）';
    },
    editShow(i) {
    	this.title = '编辑类别'
			this.flag = true;
			this.categoryForm = {
        name: this.tableData[i].csCategoryName,
        active: this.tableData[i].active,
        csCategoryId: this.tableData[i].csCategoryId,
      };
    },
    defaultAdd() {
      defaultAdd(this.addForm).then(res => {
        if (res.success) {
        	this.addForm.delFlag = true;
        	this.$message({
            type: 'success',
            message: '新增成功!'
          });
          this.messageDetail();
        }else {
					this.$message({
            type: 'error',
            message: '新增失败!'
          });
        }
      }).catch(err => {

      })
    },
    create() {
      create(this.categoryForm).then(res => {
        if (res.success) {
        	this.$message({
            type: 'success',
            message: '新增成功!'
          });
					this.flag=false;
          this.findByPage();
        }else {
					this.$message({
            type: 'error',
            message: '新增失败!'
          });
        }
      }).catch(err => {

      })
    },
    edit() {
      edit(this.categoryForm).then(res => {
        if (res.success) {
        	this.$message({
            type: 'success',
            message: '编辑成功!'
          });
					this.flag=false;
          this.findByPage();
        }else {
					this.$message({
            type: 'error',
            message: '编辑失败!'
          });
        }
      }).catch(err => {

      })
    },
    pushMessageToAppUserByCsCategory() {
      pushMessageToAppUserByCsCategory(Object.assign(this.addForm,{redirectUrl: fixOssPre(this.addForm.redirectUrl),})).then(res => {
        if (res.success) {
        	this.$message({
            type: 'success',
            message: '新增成功!'
          });
					this.flag=false;
          this.findByPage();
        }else {
					this.$message({
            type: 'error',
            message: '新增失败!'
          });
        }
      }).catch(err => {

      })
    },
    showDel(id) {
			this.$confirm('确定删除？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
				this.del();
      })
    },
    handleClick(tab, event) {
    	this.findByPage();
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
