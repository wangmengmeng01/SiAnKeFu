<template>
  <div class="app-container user-authorize">
		<el-form :inline="true" :model="searchForm" status-icon ref="callRecords" label-width="100px">
		  <el-form-item label=" 发起者昵称" prop="callerNickName">
		    <el-input v-model="searchForm.callerNickName" placeholder="请输入用户昵称"></el-input>
		   <!--  "": '',
		    "hangUpTimeBefore": '',
		    "hangUpTimeAfter": '', -->
		  </el-form-item>
		  <el-form-item label="发起者ID" prop="callerSaId">
		    <el-input v-model="searchForm.callerSaId" placeholder="请输入发起者ID"></el-input>
		  </el-form-item>
		  <el-form-item label="接受者昵称" prop="receiverNickName">
		    <el-input v-model.number="searchForm.receiverNickName" placeholder="请输入接受者昵称"></el-input>
		  </el-form-item>
		  <el-form-item label="接受者ID" prop="receiverSaId">
		    <el-input v-model.number="searchForm.receiverSaId" placeholder="请输入接受者ID"></el-input>
		  </el-form-item>
		  <el-form-item label="通话类型" prop="callType">
		  	<el-select v-model="searchForm.callType" placeholder="请选择">
			    <el-option
			      v-for="item in [{key: 1,value: '视频'},{key: 0,value: '语音'},{key: null,value: '全部'},]"
			      :key="item.key"
			      :label="item.value"
			      :value="item.key">
			    </el-option>
			  </el-select>
		  </el-form-item>
		  <el-form-item label="是否VIP通话" prop="isVipCall">
		  	<el-select v-model="searchForm.isVipCall" placeholder="请选择">
			    <el-option
			      v-for="item in [{key: true,value: '是'},{key: false,value: '否'},{key: null,value: '全部'},]"
			      :key="item.key"
			      :label="item.value"
			      :value="item.key">
			    </el-option>
			  </el-select>
		  </el-form-item>
		  <el-form-item label="是否接通" prop="hasAnswer">
		  	<el-select v-model="searchForm.hasAnswer" placeholder="请选择">
			    <el-option
			      v-for="item in [{key: true,value: '是'},{key: false,value: '否'},{key: null,value: '全部'},]"
			      :key="item.key"
			      :label="item.value"
			      :value="item.key">
			    </el-option>
			  </el-select>
		  </el-form-item>
		  <el-form-item label="开始时间" prop="callStartTime">
		    <el-date-picker
		      v-model="searchForm.callStartTime"
		      type="datetime"
		      format="yyyy-MM-dd HH:mm:ss"
		      value-format="yyyy-MM-dd HH:mm:ss"
		      placeholder="请选择">
		    </el-date-picker>
		  </el-form-item>
		  <el-form-item label="结束时间" prop="hangUpTime">
		    <el-date-picker
		      v-model="searchForm.hangUpTime"
		      type="datetime"
		      format="yyyy-MM-dd HH:mm:ss"
		      value-format="yyyy-MM-dd HH:mm:ss"
		      placeholder="请选择">
		    </el-date-picker>
		  </el-form-item>
			<el-form-item>
		    <el-button type="primary" @click="recordPage('callRecords')">搜索</el-button>
		    <el-button @click="resetForm('callRecords')">重置</el-button>
	  	</el-form-item>
		</el-form>
  	<el-table
	    :data="tableData"
	    class="table-list-container"
	    style="width: 100%">
	    <el-table-column
	      prop="callerNickName"
	      label="发起者昵称"
	      width="180">
	      <template slot-scope="scope">
	        <span @click="go(scope.row.callerUid)" style="color: #409EFF;cursor: pointer;">{{scope.row.callerNickName}}</span>
	      </template>
	    </el-table-column>
	    <el-table-column
	      prop="callerSaId"
	      label="发起者ID"
	      width="180">
	      <template slot-scope="scope">
	        <span @click="go(scope.row.callerUid)" style="color: #409EFF;cursor: pointer;">{{scope.row.callerSaId}}</span>
	      </template>
	    </el-table-column>
	    <el-table-column
	      prop="receiverNickName"
	      label="接受者昵称">
	      <template slot-scope="scope">
	        <span @click="go(scope.row.receiverUid)" style="color: #409EFF;cursor: pointer;">{{scope.row.receiverNickName}}</span>
	      </template>
	    </el-table-column>
	    <el-table-column
	      prop="receiverSaId"
	      label="接受者ID">
	      <template slot-scope="scope">
	        <span @click="go(scope.row.receiverUid)" style="color: #409EFF;cursor: pointer;">{{scope.row.receiverSaId}}</span>
	      </template>
	    </el-table-column>
	    <el-table-column
	      prop="callType"
	      label="通话类型">
				<template slot-scope="scope">
	        <span>{{scope.row.callType == 0 ? '语音' : '视频'}}</span>
	      </template>
	    </el-table-column>
	    <el-table-column
	      prop="isVipCall"
	      label="是否VIP通话">
				<template slot-scope="scope">
	        <span>{{scope.row.isVipCall ? '是' : '否'}}</span>
	      </template>
	    </el-table-column>
	    <el-table-column
	      prop="price"
	      label="通话价格 钻石/分钟">
	    </el-table-column>
	    <el-table-column
	      prop="hasAnswer"
	      label="是否接通">
				<template slot-scope="scope">
	        <span>{{scope.row.hasAnswer ? '是' : '否'}}</span>
	      </template>
	    </el-table-column>
	    <el-table-column
	      prop="callStartTime"
	      label="开始时间">
	    </el-table-column>
	    <el-table-column
	      prop="hangUpTime"
	      label="结束时间">
	    </el-table-column>
	    <el-table-column
	      prop="callCost"
	      label="消耗钻石">
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
  recordPage
} from '@/api/callConfig.js'
export default {
  name: 'callRecords',
  components: {
  },
  mixins: [TablePageMixin],
  data() {
    return {
    	searchForm: {
    		"pageSize": 10,
		    "pageNum": 0,
		    "callerNickName": null,
		    "callerSaId": null,
		    "receiverNickName": null,
		    "receiverSaId": null,
		    "callType": null,
		    "isVipCall": null,
		    "hasAnswer": null,
		    "callStartTime": null,
		    "hangUpTime": null,
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
    this.recordPage();
  },
  methods: {
		go(id) {
      this.$router.push({path: "/user-manager/user-detail",query:{uid: id}});
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
    },
    recordPage() {
			Object.keys(this.searchForm).forEach(item => {
    		if(this.searchForm.[item] === ''){
    			this.searchForm.[item] = null;
    		}
    	})
      recordPage(this.searchForm).then(res => {
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
    	this.recordPage();
    },
    handleCurrentChange(pageNum) {
    	console.log(pageNum)
    	this.searchForm.pageNum = pageNum;
    	this.recordPage();
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
