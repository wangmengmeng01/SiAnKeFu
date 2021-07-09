<template>
  <div class="app-container user-authorize">
		<el-form :inline="true" :model="searchForm" status-icon ref="callRecords" label-width="100px">
		  <el-form-item label=" 客服名称" prop="nickName">
		    <el-input v-model="searchForm.sysUserName" placeholder="请输入客服名称"></el-input>
		  </el-form-item>
		  <el-form-item label="选择日期" prop="saId">
		    <el-date-picker
		      v-model="searchForm.time"
		      type="daterange"
		      format="yyyy-MM-dd"
		      value-format="yyyy-MM-dd"
		      range-separator="至"
		      start-placeholder="开始日期"
		      end-placeholder="结束日期">
		    </el-date-picker>
		  </el-form-item>
			<el-form-item>
		    <el-button type="primary" @click="findStatisticsByPage()">搜索</el-button>
		    <el-button @click="resetForm('callRecords')">重置</el-button>
		    <el-button icon="el-icon-download" type="primary" @click="exportFile()">导出</el-button>
	  	</el-form-item>
		</el-form>
  	<el-table
	    :data="tableData"
	    class="table-list-container"
	    style="width: 100%">
	    <el-table-column
	      prop="sysUserName"
	      label="客服名称"
	      width="180">
	    </el-table-column>
	    <el-table-column
	      prop="assignSessionTaskCount"
	      label="分配会话数"
	      width="180">
	    </el-table-column>
	    <el-table-column
	      prop="finishSessionTaskCount"
	      label="完成会话数">
	    </el-table-column>
	    <el-table-column
	      prop="finishSessionPersonCount"
	      label="完成会话人数">
	    </el-table-column>
	    <el-table-column
	      prop="sessionCsMsgCount"
	      label="会话消息条数（仅客服）">
	    </el-table-column>
	    <el-table-column
	      prop="statisticsDate"
	      label="日期">
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
  findStatisticsByPage,
} from '@/api/customerManagement.js'
export default {
  name: 'workRecord',
  components: {
  },
  mixins: [TablePageMixin],
  data() {
    return {
    	searchForm: {
    		"pageSize": 10,
		    "pageNum": 0,
		    "sysUserName": null,
		    "time": [],
		    "startStatisticsDate": null,
		    "endStatisticsDate": null,
      },
    	flag:false,
    	total:1,
    	tableData: [],
    }
  },
  created() {
    this.findStatisticsByPage();
  },
  methods: {
		go(id) {
      this.$router.push({path: "/user-manager/user-detail",query:{uid: id}});
    },
    exportFile() {
			Object.keys(this.searchForm).forEach(item => {
    		if(this.searchForm.[item] === ''){
    			this.searchForm.[item] = null;
    		}
    	})
			if (this.searchForm.time.length == 2) {
	    	this.searchForm.startStatisticsDate = this.searchForm.time[0]
	    	this.searchForm.endStatisticsDate = this.searchForm.time[1]
    	}else {
				this.searchForm.startStatisticsDate = null;
	    	this.searchForm.endStatisticsDate = null;
    	}
    	this.$store.dispatch("app/exportFile",{
        url: '/console/csr/desk/cs/downloadStatistics',
        data: this.searchForm,
        name: '工作记录',
      })
    },
    findStatisticsByPage() {
			Object.keys(this.searchForm).forEach(item => {
    		if(this.searchForm.[item] === ''){
    			this.searchForm.[item] = null;
    		}
    	})
			if (this.searchForm.time.length == 2) {
	    	this.searchForm.startStatisticsDate = this.searchForm.time[0]
	    	this.searchForm.endStatisticsDate = this.searchForm.time[1]
    	}else {
				this.searchForm.startStatisticsDate = null;
	    	this.searchForm.endStatisticsDate = null;
    	}
      findStatisticsByPage(this.searchForm).then(res => {
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
    	this.searchForm.pageSize = pageSize;
    	this.findStatisticsByPage();
    },
    handleCurrentChange(pageNum) {
    	console.log(pageNum)
    	this.searchForm.pageNum = pageNum;
    	this.findStatisticsByPage();
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
