<template>
  <Select
    v-model="model"
    url="/console/sysDict/getDetail"
    :http="remoteHttp"
    :params="{ pageNum: 1, pageSize: 99999 }"
    value-key="id"
    label-key="roleName"
    :exclude="exclude"
    :filterable="false"
    auto
    multiple
    size="large"
    @change="change"
  />
</template>

<script>
import { makeAPI } from '@/api/httpRequest'
import Select from '@/components/Select'
const REQUEST_API = {
  search: {
    url: '/console/acl/role/page',
    method: 'post'
  }
}
export default {
  name: 'DictSelect',
  components: {
    Select
  },
  props: {
    value: [String, Array],
    dictType: String,
    exclude: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      remoteHttp: makeAPI(REQUEST_API).search
    }
  },
  computed: {
    model: {
      get() {
        return this.value
      },
      set(val) {
        this.$emit('input', val)
      }
    }
  },
  methods: {
    change(val) {
      this.$emit('change', val)
    }
  }
}
</script>

<style scoped>

</style>
