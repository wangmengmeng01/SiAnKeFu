<template>
  <div class="bg">
    <el-input v-if="type == 'input'" v-model="bindValue" placeholder="未填写" size="mini" style="width: 100px;" :disabled="flag"></el-input>
		<el-select v-else size="mini" style="width: 100px;" v-model="bindValue" :disabled="flag" placeholder="请选择">
	    <el-option
	      v-for="t in list"
	      :key="t[name]"
	      :label="t[label]"
	      :value="t[name]">
	    </el-option>
	  </el-select>
	  <span class="btn" v-show="flag" @click="flag = false">修改</span>
	  <span class="btn" v-show="!flag"  @click="flag = true,bindValue = oldValue">取消</span>
	  <span class="btn" v-show="!flag" @click="editByUid">提交</span>
  </div>
</template>

<script>
// @ is an alias to /src

export default {
  name: 'editBtn',
  components: {
  },
  model: {
  	prop: 'value',
    event: 'input',
  },
  props: {
  	value: {
  		default: '',
  	},
  	list: {
  		type: Array,
  		default: function() {
  			return [];
  		},
  	},
  	submit: {
  		type: Function,
  	},
  	label: {
  		type: String,
  		default: 'name',
  	},
    type: {
      type: String,
      default: 'input',
    },
  	name: {
  		type: String,
  		default: 'id',
  	},
  },
  computed: {
  },
  watch: {
    value(val) {
      this.oldValue = val;
      this.bindValue = val;
    }
  },
  data() {
    return {
    	flag: true,
    	oldValue: '',
      bindValue: '',
    }
  },
  created() {
  },
  mounted() {
  },
  methods: {
    editByUid(i) {
    	this.$emit('input',this.bindValue);
    	this.submit();
      this.flag = true;
    }
  }
}
</script>
<style lang="scss" scoped>
.btn {
  margin-left: 5px;
  color: #409EFF;
  font-size: 12px;
  white-space: nowrap;
}
</style>