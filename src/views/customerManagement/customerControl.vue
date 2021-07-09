<template>
  <div class="app-container user-authorize">
		<div class="title">
			<span>当前客服在线情况</span>
			<span style="color: green;">在线:</span>
			<span>{{status.line}}</span>
			<span style="color: red;">忙碌:</span>
			<span>{{status.buy}}</span>
			<span style="color: #666;">下线:</span>
			<span>{{status.out}}</span>
		</div>
  	<el-table
	    :data="tableData"
	    class="table-list-container"
	    style="width: 100%">
	    <el-table-column
	      prop="sysUserName"
	      label="客服昵称"
	      width="180">
	    </el-table-column>
	    <el-table-column
	      prop="currentHandlingSessionCount"
	      label="当前接待会话数量"
	      width="180">
	    </el-table-column>
	    <el-table-column
	      prop="workerStatus"
	      label="当前状态">
				<template slot-scope="scope">
					<span v-if="scope.row.workerStatus == 1" style="color: green;">在线</span>
					<span v-else-if="scope.row.workerStatus == 2" style="color: red;">忙碌</span>
					<span v-else-if="scope.row.workerStatus == 3" style="color: #666;">下线</span>
					<span v-else="scope.row.workerStatus == 4" style="color: #666;">未知</span>
	      </template>
	    </el-table-column>
	  </el-table>
	  <div style="display: flex;justify-content: center;padding: 30px 0;">
	  </div>
  </div>
</template>

<script>

import API from '@/api/user-manager'
import {url} from '@/utils/elValid.js'
import TablePageMixin from '@/mixins/table-page'
import {
  findMonitor,
} from '@/api/customerManagement.js'
export default {
  name: 'workRecord',
  components: {
  },
  mixins: [TablePageMixin],
  data() {
    return {
    	total:0,
    	tableData: [],
    	status: {
    		line: 0,
    		buy: 0,
    		out: 0,
    	},
    }
  },
  created() {
    this.findMonitor();
  },
  methods: {
		go(id) {
      this.$router.push({path: "/user-manager/user-detail",query:{uid: id}});
    },
    findMonitor() {
      findMonitor({}).then(res => {
        if (res.success) {
					this.tableData = res.data;
					this.status = {
						line: 0,
						buy: 0,
						out: 0,
					};
    			this.tableData.forEach(item => {
    				switch(item.workerStatus){
    					case 1 :
    						this.status.line++;
    						break;
  						case 2 :
    						this.status.buy++;
    						break;
  						case 3 :
    						this.status.out++;
    						break;
    				}
    			})
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
    },
    handleCurrentChange(pageNum) {
    },
    handleClose(uid) {
    },

  }
}
</script>
<style scoped lang="scss">
.title {
	height: 100px;
	line-height: 100px;
	span:nth-child(1) {
		color: #000;
	}
	span:nth-child(even) {
		margin-left: 20px;
		margin-right: 5px;
	}
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
