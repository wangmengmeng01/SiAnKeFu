<template>
  <Select
    v-model="model"
    url="/console/sysDict/getDetail"
    :http="remoteHttp"
    :params="{ dictTypeCode: dictType }"
    value-key="dictDetailCode"
    label-key="dictDetailName"
    :exclude="exclude"
    :filterable="false"
    auto
    :size="size"
    @change="change"
  />
</template>

<script>
import { makeAPI } from '@/api/httpRequest'
import Select from '@/components/Select'
const REQUEST_API = {
  search: {
    url: '/console/sysDict/getDetail',
    method: 'get'
  }
}
export default {
  name: 'DictSelect',
  components: {
    Select
  },
  props: {
    value: String,
    dictType: String,
    size: {
      type: String,
      default: 'large'
    },
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
