<template>
  <div class="app-container user-authorize">
		<el-form :inline="true" :model="searchForm" status-icon ref="vipList" label-width="100px">
			  <el-form-item label=" 昵称" prop="nickName">
			    <el-input v-model="searchForm.nickName" placeholder="请输入用户昵称"></el-input>
			  </el-form-item>
			  <el-form-item label="ID" prop="saId">
			    <el-input v-model="searchForm.saId" placeholder="请输入用户ID"></el-input>
			  </el-form-item>
			  <el-form-item label="手机号" prop="mobile">
			    <el-input v-model.number="searchForm.mobile" placeholder="请输入用户手机号"></el-input>
			  </el-form-item>
			  <el-form-item label="开通时间" prop="openingTime">
			    <el-date-picker
			      v-model="searchForm.openingTime"
			      type="datetimerange"
			      format="yyyy-MM-dd HH:mm:ss"
			      value-format="yyyy-MM-dd HH:mm:ss"
			      range-separator="至"
			      start-placeholder="开始日期"
			      end-placeholder="结束日期">
			    </el-date-picker>
			  </el-form-item>
			  <el-form-item label="到期时间" prop="expireTime">
			    <el-date-picker
			      v-model="searchForm.expireTime"
			      type="datetimerange"
			      format="yyyy-MM-dd HH:mm:ss"
			      value-format="yyyy-MM-dd HH:mm:ss"
			      range-separator="至"
			      start-placeholder="开始日期"
			      end-placeholder="结束日期">
			    </el-date-picker>
			  </el-form-item>
				<el-form-item>
			    <el-button type="primary" @click="findByPage('vipList')">搜索</el-button>
			    <el-button @click="resetForm('vipList')">重置</el-button>
			    <el-button icon="el-icon-download" type="primary" @click="exportFile()">导出</el-button>
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
	      prop="mobile"
	      label="手机号">
	    </el-table-column>
	    <el-table-column
	      prop="diamondNumber"
	      label="钻石余额">
	    </el-table-column>
	    <el-table-column
	      prop="openingTime"
	      label="最新开通时间">
	    </el-table-column>
	    <el-table-column
	      prop="expireTime"
	      label="到期时间">
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
  </div>
</template>

<script>

import API from '@/api/user-manager'
import {url} from '@/utils/elValid.js'
import TablePageMixin from '@/mixins/table-page'
import {
  findByPage
} from '@/api/configManager.js'
export default {
  name: 'vipList',
  components: {
  },
  mixins: [TablePageMixin],
  data() {
    return {
    	searchForm: {
        nickName: '',
        openingTime: [],
        expireTime: [],
        saId: '',
        mobile: '',
        startOpeningTime: '',
        endOpeningTime: '',
        startExpireTime: '',
        endExpireTime: '',
        pageSize: 10,
        pageNum: 1,
      },
      rules: {
        pass: [
          { validator: url, trigger: 'blur' }
        ],
      },
    	dialogVisible:true,
    	currentPage:1,
    	total:1,
    	tableData: [],
    }
  },
  created() {
    this.findByPage();
  },
  methods: {
		exportFile() {
			if (this.searchForm.openingTime.length == 2) {
	    	this.searchForm.startOpeningTime = this.searchForm.openingTime[0]
	    	this.searchForm.endOpeningTime = this.searchForm.openingTime[0]
    	}else {
				this.searchForm.startOpeningTime = ''
	    	this.searchForm.endOpeningTime = ''
    	}
    	if (this.searchForm.expireTime.length == 2) {
	    	this.searchForm.startExpireTime = this.searchForm.expireTime[0]
	    	this.searchForm.endExpireTime = this.searchForm.expireTime[0]
    	}else {
				this.searchForm.startExpireTime = ''
	    	this.searchForm.endExpireTime = ''
    	}
			Object.keys(this.searchForm).forEach(item => {
    		if(this.searchForm.[item] === ''){
    			this.searchForm.[item] = null;
    		}
    	})
    	this.$store.dispatch("app/exportFile",{
        url: '/console/userVip/download',
        data: this.searchForm,
        name: 'vip列表',
      })
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
    },
    findByPage() {
    	if (this.searchForm.openingTime.length == 2) {
	    	this.searchForm.startOpeningTime = this.searchForm.openingTime[0]
	    	this.searchForm.endOpeningTime = this.searchForm.openingTime[0]
    	}else {
				this.searchForm.startOpeningTime = ''
	    	this.searchForm.endOpeningTime = ''
    	}
    	if (this.searchForm.expireTime.length == 2) {
	    	this.searchForm.startExpireTime = this.searchForm.expireTime[0]
	    	this.searchForm.endExpireTime = this.searchForm.expireTime[0]
    	}else {
				this.searchForm.startExpireTime = ''
	    	this.searchForm.endExpireTime = ''
    	}
			Object.keys(this.searchForm).forEach(item => {
    		if(this.searchForm.[item] === ''){
    			this.searchForm.[item] = null;
    		}
    	})
      findByPage(this.searchForm).then(res => {
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
		go(id) {
      this.$router.push({path: "/user-manager/user-detail",query:{uid: id}});
    },
    handleSizeChange(pageSize) {
    	this.searchForm.pageSize = pageSize;
    	this.findByPage();
    },
    handleCurrentChange(pageNum) {
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
