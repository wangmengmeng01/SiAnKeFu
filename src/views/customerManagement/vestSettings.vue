<template>
  <div class="app-container user-authorize">
		<el-form :inline="true" :model="searchForm" status-icon ref="callRecords" label-width="100px">
		  <el-form-item label=" 马甲名称" prop="nickName">
		    <el-input v-model="searchForm.nickName" placeholder="请输入马甲名称"></el-input>
		  </el-form-item>
		  <el-form-item label="ID" prop="saId">
		    <el-input v-model="searchForm.saId" placeholder="请输入ID"></el-input>
		  </el-form-item>
		  <el-form-item label="马甲类别" prop="csCategoryId">
		  	<el-select v-model="searchForm.csCategoryId" placeholder="请选择">
			    <el-option
			      v-for="item in roleList"
			      :key="item.csCategoryId"
			      :label="item.csCategoryName"
			      :value="item.csCategoryId">
			    </el-option>
			  </el-select>
		  </el-form-item>
			<el-form-item>
		    <el-button type="primary" @click="vestByPage('callRecords')">搜索</el-button>
		    <el-button @click="resetForm('callRecords')">重置</el-button>
		    <el-button type="primary" icon="el-icon-plus" @click="show()">新增客服马甲</el-button>
	  	</el-form-item>
		</el-form>
  	<el-table
	    :data="tableData"
	    class="table-list-container"
	    style="width: 100%">
	    <el-table-column
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
	      prop="csCategoryName"
	      label="马甲类别">
	    </el-table-column>
	    <el-table-column
	      prop="createByName"
	      label="操作人">
	    </el-table-column>
	    <el-table-column
	      prop="createTime"
	      label="创建时间">
	    </el-table-column>
	    <el-table-column
	      prop="callCost"
	      label="操作">
				<template slot-scope="scope">
	        <span @click="findBindViewUser(scope.row.uid)" style="color: #409EFF;cursor: pointer;">查看绑定用户</span>
	      </template>
	    </el-table-column>
	  </el-table>
	  <div style="display: flex;justify-content: center;padding: 30px 0;">
		  <el-pagination
	      @size-change="handleSizeChange"
	      @current-change="handleCurrentChange"
	      :current-page="searchForm.pageNum"
	      :page-sizes="[10, 50, 100, 200, 400,]"
	      :page-size="10"
	      layout="total, sizes, prev, pager, next, jumper"
	      :total="total">
	    </el-pagination>
	  </div>
		<el-dialog
		  :title="title"
		  :visible.sync="flag"
		  width="50%"
		  >
		  <el-form :model="vestForm" status-icon :rules="rules" ref="vestForm" label-width="100px">
			  <el-form-item label=" 选择角色类型" prop="csCategoryId">
					<el-select v-model="vestForm.csCategoryId" placeholder="请选择">
				    <el-option
				      v-for="item in roleList"
				      :key="item.csCategoryId"
				      :label="item.csCategoryName"
				      :value="item.csCategoryId">
				    </el-option>
				  </el-select>
			  </el-form-item>
			  <el-form-item label="绑定马甲" prop="saId">
			    <el-input maxlength="6" v-model="vestForm.saId" placeholder="请输入绑定的马甲ID"></el-input>
			  </el-form-item>
			</el-form>
		  <span slot="footer" class="dialog-footer">
		    <el-button @click="resetForm('vestForm')">取 消</el-button>
		    <el-button type="primary" @click="submitForm('vestForm')">确 定</el-button>
		  </span>
		</el-dialog>
		<el-dialog
		  :title="title"
		  :visible.sync="detailFlag"
		  width="400px"
		  >
		  <div style="height: 500px;overflow: auto;">
			  <div class="detail" @click="go(item.uid)" v-for="item in detailList">{{item.nickName}}</div>
		  </div>
		</el-dialog>
  </div>
</template>

<script>

import API from '@/api/user-manager'
import {url} from '@/utils/elValid.js'
import TablePageMixin from '@/mixins/table-page'
import {
  vestByPage,
  findEffective,
  vestCreate,
  vestEdit,
  findBindViewUser,
} from '@/api/customerManagement.js'
export default {
  name: 'vestSettings',
  components: {
  },
  mixins: [TablePageMixin],
  data() {
    return {
    	searchForm: {
    		"pageSize": 10,
		    "pageNum": 0,
		    "nickName": null,
		    "saId": null,
		    "csCategoryId": null,
      },
    	detailFlag:false,
    	title:'新增客服马甲',
			vestForm: {
        csCategoryId: '',
        saId: '',
      },
      rules: {
        saId: [
          { required: true,message: '该项必填', trigger: 'blur' },
        ],
      },
    	flag:false,
    	currentPage:1,
    	total:1,
    	tableData: [],
    	roleList: [],
    	detailList: [],
    }
  },
  created() {
    this.findEffective();
    this.vestByPage();
  },
  methods: {
		go(id) {
      this.$router.push({path: "/user-manager/user-detail",query:{uid: id}});
    },
    show(id) {
    	this.title = '新增客服马甲';
    	this.flag = true;
			this.vestForm = {
        csCategoryId: '',
        saId: '',
      }
    },
    resetForm(formName) {
    	this.flag = false;
      this.$refs[formName].resetFields();
    },
		submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          switch (this.title) {
          	case '新增客服马甲':
          		this.vestCreate();
          		break;
          	case '编辑客服马甲':
          		this.vestEdit();
          		break;
          }
        } else {
          console.log('error submit!!');
          return false;
        }
      });
    },
    vestByPage() {
			Object.keys(this.searchForm).forEach(item => {
    		if(this.searchForm.[item] === ''){
    			this.searchForm.[item] = null;
    		}
    	})
      vestByPage(this.searchForm).then(res => {
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
    findEffective() {
			// 角色列表
      findEffective().then(res => {
        if (res.success) {
					this.roleList = res.data;
        }else {
        	this.$message({
            type: 'error',
            message: res.msg
          });
        }
      }).catch(err => {

      })
    },
    vestCreate() {
      vestCreate(this.vestForm).then(res => {
        if (res.success) {
					this.$message({
            type: 'success',
            message: "新增成功"
          });
					this.flag = false;
        }else {
        	this.$message({
            type: 'error',
            message: res.msg
          });
        }
      }).catch(err => {

      })
    },
    vestEdit() {
      vestEdit(this.searchForm).then(res => {
        if (res.success) {
					this.$message({
            type: 'success',
            message: "修改成功"
          });
					this.flag = false;
        }else {
        	this.$message({
            type: 'error',
            message: res.msg
          });
        }
      }).catch(err => {

      })
    },
    findBindViewUser(packerUid) {
    	this.detailFlag = true;
      findBindViewUser({packerUid}).then(res => {
        if (res.success) {
					this.detailList=res.data;
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
    	this.searchForm.pageSize = pageSize;
    	this.vestByPage();
    },
    handleCurrentChange(pageNum) {
    	console.log(pageNum)
    	this.searchForm.pageNum = pageNum;
    	this.vestByPage();
    },
    handleClose(uid) {
    },

  }
}
</script>
<style scoped lang="scss">
.detail {
	border-bottom: 1px solid #eee;
	padding: 10px;
	text-align: center;
	color: #409EFF;
	cursor: pointer;
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
