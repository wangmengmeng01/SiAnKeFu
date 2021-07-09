<template>
  <div class="app-container user-authorize">
		<el-form :inline="true" :model="searchForm" status-icon ref="vipList" label-width="100px">
		  <el-form-item label=" 昵称" prop="nickName">
		    <el-input v-model="searchForm.nickName" placeholder="请输入用户昵称"></el-input>
		  </el-form-item>
		  <el-form-item label="ID" prop="saId">
		    <el-input v-model="searchForm.saId" placeholder="请输入用户ID"></el-input>
		  </el-form-item>
		  <el-form-item label="创建时间" prop="time">
		    <el-date-picker
		      v-model="searchForm.time"
		      type="datetimerange"
		      format="yyyy-MM-dd HH:mm:ss"
		      value-format="yyyy-MM-dd HH:mm:ss"
		      range-separator="至"
		      start-placeholder="开始日期"
		      end-placeholder="结束日期">
		    </el-date-picker>
		  </el-form-item>
			<el-form-item>
		    <el-button icon="el-icon-search" type="primary"  @click="findByPage()">搜索</el-button>
		    <el-button @click="resetForm('vipList')">重置</el-button>
		    <el-button type="primary" icon="el-icon-plus" @click="addShow()">新增账号</el-button>
	  	</el-form-item>
		</el-form>
  	<el-table
	    :data="tableData"
	    class="table-list-container"
	    style="width: 100%">
	    <el-table-column
	    	style="color: #409EFF;"
	      prop="nickName"
	      label="昵称"
	      width="180">
	      <template slot-scope="scope">
	        <span @click="go(scope.row.uid)" style="color: #409EFF;cursor: pointer;">{{scope.row.nickName}}</span>
	      </template>
	    </el-table-column>
	    <el-table-column
	      prop="saId"
	      label="ID"
	      width="180">
	      <template slot-scope="scope">
	        <span @click="go(scope.row.uid)" style="color: #409EFF;cursor: pointer;">{{scope.row.saId}}</span>
	      </template>
	    </el-table-column>
	    <el-table-column
	      prop="goldNumber"
	      label="金币余额">
	    </el-table-column>
	    <el-table-column
	      prop="createTime"
	      label="创建时间">
	    </el-table-column>
	    <el-table-column
	      prop="address"
	      label="操作">
	      <template slot-scope="scope">
					<el-button @click="editShow(scope.row.uid)" type="text" size="small">编辑</el-button>
	        <el-button @click="releaseShow(scope.row.uid)" type="text" size="small">发布动态</el-button>
	      </template>
	    </el-table-column>
	  </el-table>
	  <div style="display: flex;justify-content: center;padding: 30px 0;">
		  <el-pagination
	      @size-change="handleSizeChange"
	      @current-change="handleCurrentChange"
	      :current-page="currentPage"
	      :page-sizes="[10, 50, 100, 200, 400,]"
	      :page-size="10"
	      layout="total, sizes, prev, pager, next, jumper, slot"
	      :total="total">
	    </el-pagination>
	  </div>
		<el-dialog
		  :title="title"
		  :visible.sync="flag"
		  width="50%"
		  >
		  <el-form :model="form" status-icon :rules="rules" ref="vestForm" label-width="110px" label-position="left">
				<el-row :gutter="20">
          <el-col :span="12">
						<el-form-item label="设置昵称" prop="nickName">
				    	<el-input maxlength="10" v-model="form.nickName" placeholder="请设置昵称"></el-input>
				  	</el-form-item>
          </el-col>
          <el-col :span="12">
						<el-form-item label=" 设置头像" prop="avatar">
				    	<sa-upload v-model="form.avatar" accept="image/png, image/jpg, image/jpeg" style="width: 100px; height: 100px;" :size="2">
                <p slot="tip">2M 以内的png/jpeg/jpg 格式</p>
              </sa-upload>
				  	</el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
						<el-form-item label="设置性别" prop="sex">
							<el-radio v-model="form.sex" label="1">男</el-radio>
  						<el-radio v-model="form.sex" label="2">女</el-radio>
				  	</el-form-item>
          </el-col>
          <el-col :span="12">
						<el-form-item label=" 设置头像为真人" prop="realPeopleAvatarStatus">
							<el-switch
							  v-model="form.realPeopleAvatarStatus"
							  active-value="1"
    						inactive-value="0"
							  active-text="开"
							  inactive-text="关"
							  active-color="#ff4949"
  							inactive-color="#13ce66">
							</el-switch>
				  	</el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
						<el-form-item label="设置出生年月" prop="birthday">
				    	<el-date-picker
				    		style="width: 100%;"
					      v-model="form.birthday"
					      format="yyyy-MM-dd"
					      value-format="yyyy-MM-dd"
					      type="date"
					      placeholder="选择日期">
					    </el-date-picker>
				  	</el-form-item>
          </el-col>
          <el-col :span="12">
						<el-form-item label=" 设置个性标签" prop="realPeopleAvatarStatus">
							<el-select :multiple-limit="3" v-model="form.tagIds" multiple placeholder="请选择">
						    <el-option
						      v-for="item in options"
						      :key="item.tagId"
						      :label="item.tagName"
						      :value="item.tagId">
						    </el-option>
						  </el-select>
				  	</el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
						<el-form-item label=" 设置体重" prop="weight">
				    	<el-input v-model.number="form.weight" placeholder="输入身高cm"></el-input>
				  	</el-form-item>
          </el-col>
          <el-col :span="12">
						<el-form-item label=" 设置身高" prop="height">
				    	<el-input v-model.number="form.height" placeholder="输入体重kg"></el-input>
				  	</el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
						<el-form-item label="设置语音签名" prop="url">
				    	<sa-upload v-model="form.url" fileType="file" accept="audio/mp3,audio/mpeg" style="width: 100px; height: 100px;" :size="10">
                <p slot="tip">仅支持MP3格式，10M以内</p>
              </sa-upload>
				  	</el-form-item>
          </el-col>
          <el-col :span="12">
          </el-col>
        </el-row>
			</el-form>
		  <span slot="footer" class="dialog-footer">
		    <el-button @click="resetForm('vestForm')">取 消</el-button>
		    <el-button type="primary" @click="submitForm('vestForm')">确 定</el-button>
		  </span>
		</el-dialog>
		<!-- 发布动态 -->
		<el-dialog
		  :title="title"
		  :visible.sync="releaseFlag"
		  width="50%"
		  >
		  <el-form :model="releaseForm" status-icon :rules="rules" ref="releaseForm" label-width="110px" label-position="left">
				<el-form-item label="文字内容" prop="content">
		    	<el-input type="textarea" maxlength="100" v-model="releaseForm.content" placeholder="请输入相关文字内容"></el-input>
		  	</el-form-item>
		  	<el-form-item label="图片或视频" prop="images">
		  		<div  style="">
						<el-select @change="change" v-model="imgFlag" style="margin-right: 10px;vertical-align: top;" placeholder="请选择">
							<el-option
					      v-for="item in [{key: true, value: '图片',},{key: false, value: '视频',},]"
					      :key="item.key"
					      :label="item.value"
					      :value="item.key">
					    </el-option>
					  </el-select>
			    	<sa-upload v-show="imgFlag" multiple :limit="9" v-model="releaseForm.images" accept="image/png, image/jpg, image/jpeg" style="width: 100px; height: 100px;" :size="10">
	            <p slot="tip">（图片最多9张，支持PNG，jpeg，jpg格式，单张10M以内 ）</p>
	          </sa-upload>
	          <sa-upload  v-show="!imgFlag"  fileType="file" v-model="releaseForm.videoUrl" accept="video/mp4,video/webm,video/ogg," style="width: 100px; height: 100px;" :size="100">
	            <p slot="tip">（视频最多一个）</p>
	          </sa-upload>
		  		</div>
		  	</el-form-item>
		  	<el-form-item label="选择话题" prop="topicId">
		    	<el-select v-model="releaseForm.topicId" placeholder="请选择">
				    <el-option
				      v-for="item in topic"
				      :key="item.topicId"
				      :label="item.synopsis"
				      :value="item.topicId">
				    </el-option>
				  </el-select>
		  	</el-form-item>
		  	<el-form-item label="谁可以看" prop="viewAuth">
		    	<el-select v-model="releaseForm.viewAuth" placeholder="请选择">
						<el-option
				      v-for="item in [{key: 'OPEN', value: '公开',},{key: 'VIP', value: 'VIP可见',},]"
				      :key="item.key"
				      :label="item.value"
				      :value="item.key">
				    </el-option>
				  </el-select>
	    	</el-form-item>
			</el-form>
		  <span slot="footer" class="dialog-footer">
		    <el-button @click="resetForm('releaseForm')">取 消</el-button>
		    <el-button type="primary" @click="submitForm('releaseForm')">确 定</el-button>
		  </span>
		</el-dialog>
  </div>
</template>

<script>

import API from '@/api/user-manager'
import { fixOssPre } from '@/utils'
import {height,weight} from '@/utils/elValid.js'
import TablePageMixin from '@/mixins/table-page'
import saUpload from '@/components/UploadCloud'
import {
  findVestByPage,
  createUserPacker,
  editUserPacker,
  publishDynamic,
  findAllAvailable,
  pageList,
  findUserDetailByUid,
} from '@/api/configManager.js'
export default {
  name: 'vestList',
  components: {
  	saUpload
  },
  mixins: [TablePageMixin],
  data() {
    return {
    	imgFlag: true,
    	searchForm: {
        nickName: '',
        time: [],
        saId: '',
        startCreateTime: '',
        endCreateTime: '',
        pageSize: 10,
        pageNum: 1,
      },
      form: {
        url: '',
        nickName: '',
        avatar: '',
        realPeopleAvatarStatus: '1',
        sex: '1',
        birthday: '',
        height: '',
        weight: '',
        tagIds: [],
        voiceSignature: {
        	duration: 0,
        	url: '',
        },
      },
      rules: {
        nickName: [
          { required: true,message: '该项必填', trigger: 'blur' },
        ],
        avatar: [
          { required: true,message: '该项必填', trigger: 'blur' },
        ],
        sex: [
          {required: true,message: '该项必填', trigger: 'blur' }
        ],
        birthday: [
          {required: true,message: '该项必填', trigger: 'blur' }
        ],
        images: [
          {required: true,message: '该项必填', trigger: 'blur' }
        ],
        height: [
          {validator: height,trigger: 'blur' }
        ],
        weight: [
          {validator: weight,trigger: 'blur' }
        ],
      },
    	flag:false,
    	releaseFlag:false,
    	releaseForm:{
    		uid: '',
    		content: '',
    		videoUrl: '',
    		video: {
    			url: '',
    			expand: null,
    		},
    		topicId: '',
    		viewAuth: 'OPEN',
    		imagesList: [],
    		images: [],
    	},
    	title:'新增账号（*为必填信息）',
    	currentPage:1,
    	total:1,
    	tableData: [],
    	options: [],
    	topic: [],
    	detail: {},
    }
  },
  created() {
    this.findByPage();
    this.findAllAvailable();
    this.pageList();
  },
  methods: {
    change(res, file) {
    	// this.releaseForm.imagesList = [];
    },
    findAllAvailable() {
      findAllAvailable().then(res => {
        if (res.success) {
					this.options=res.data;
        }else {
        }
      }).catch(err => {

      })
    },
    pageList() {
      pageList({status: 1,pageSize: 100,}).then(res => {
        if (res.success) {
					this.topic=res.data.list;
        }else {
        }
      }).catch(err => {

      })
    },
    createUserPacker() {
    	// this.form.voiceSignature.url = this.form.url;
			this.form.avatar = fixOssPre(this.form.avatar)
			this.form.voiceSignature.url = fixOssPre(this.form.url)
      createUserPacker(this.form).then(res => {
        if (res.success) {
        	this.$message({
            type: 'success',
            message: '新增成功!'
          });
					this.flag = false;
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
    editUserPacker() {
    	this.form.voiceSignature.url = fixOssPre(this.form.url)
      editUserPacker(Object.assign(this.form,{avatar: fixOssPre(this.form.avatar)})).then(res => {
        if (res.success) {
        	this.$message({
            type: 'success',
            message: '编辑成功!'
          });
					this.flag = false;
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
    publishDynamic(id) {
    	let params = JSON.parse(JSON.stringify(this.releaseForm))
    	if (this.imgFlag) {
				params.imagesList = params.images.map(function(item) {
	    		return {url:fixOssPre(item.url)};
	    	});
	    	params.video = null;
    	}else {
    		params.imagesList = [];
	    	params.video.url = fixOssPre(params.videoUrl)
    	}
      publishDynamic(params).then(res => {
        if (res.success) {
        	this.$message({
            type: 'success',
            message: '发布成功!'
          });
					this.releaseFlag = false;
          this.releaseFlag();
        }else {
					this.$message({
            type: 'error',
            message: '发布失败!'
          });
        }
      }).catch(err => {

      })
    },
    go(id) {
      this.$router.push({path: "/user-manager/user-detail",query:{uid: id}});
    },
    findUserDetailByUid(id) {
      findUserDetailByUid({uid: id}).then(res => {
        if (res.success) {
					this.detail = res.data;
					this.form.uid = id;
		    	this.form.nickName = this.detail.nickName;
		    	this.form.avatar = this.detail.avatar;
		    	this.form.realPeopleAvatarStatus = this.detail.realNameAuthorizeStatus;
		    	this.form.sex = this.detail.sex + '';
		    	this.form.birthday = this.detail.birthday;
		    	this.form.height = this.detail.height;
		    	this.form.weight = this.detail.weight;
		    	this.form.tagIds = this.detail.tags.map(function(item) {
		    		return item.tagId;
		    	});
		    	this.form.voiceSignature.url = this.detail.voiceSignature.url;
		    	console.log(this.form,'this.form')
        }
      }).catch(err => {

      })
    },
    releaseShow(id) {
    	this.releaseForm.videoUrl = '';
    	this.releaseForm.images = [];
    	this.releaseFlag = true;
    	this.releaseForm.uid = id;
    	this.title = '发布动态';
    },
    editShow(id) {
    	this.findUserDetailByUid(id);
    	this.title = '编辑账号（*为必填信息）';
    	this.flag = true;
    },
    addShow(id) {
			this.form = {
        url: '',
        nickName: '',
        avatar: '',
        realPeopleAvatarStatus: '1',
        sex: '1',
        birthday: '',
        height: '',
        weight: '',
        tagIds: [],
        voiceSignature: {
	        	duration: 1,
	        	url: '',
	        },
	      }
    	this.title = '新增账号（*为必填信息）';
    	this.flag = true;
    },
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          switch (this.title) {
          	case '新增账号（*为必填信息）':
          		this.createUserPacker();
          		break;
          	case '编辑账号（*为必填信息）':
          		this.editUserPacker();
          		break;
          	case '发布动态':
          		this.publishDynamic();
          		break;
          }
        } else {
          console.log('error submit!!');
          return false;
        }
      });
    },
		resetForm(formName) {
      this.$refs[formName].resetFields();
      this.flag = false;
      this.releaseFlag = false;
    },
    findByPage() {
    	if (this.searchForm.time.length == 2) {
	    	this.searchForm.startCreateTime = this.searchForm.time[0]
	    	this.searchForm.endCreateTime = this.searchForm.time[1]
    	}else {
				this.searchForm.startCreateTime = ''
	    	this.searchForm.endCreateTime = ''
    	}
    	Object.keys(this.searchForm).forEach(item => {
    		if(this.searchForm.[item] === ''){
    			this.searchForm.[item] = null;
    		}
    	})
      findVestByPage(this.searchForm).then(res => {
        if (res.success) {
					this.tableData=res.data.list;
					this.total=res.data.total;
        }else {
        	this.$message({
            type: 'error',
            message: res.msg
          });
        }
      }).catch(err => {

      })
    },
    handleSizeChange(pageSize) {
    	console.log(pageSize)
    	this.searchForm.pageNum = pageSize;
    	this.findByPage();
    },
    handleCurrentChange(pageNum) {
    	console.log(pageNum)
    	this.searchForm.pageNum = pageNum;
    	this.findByPage();
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
