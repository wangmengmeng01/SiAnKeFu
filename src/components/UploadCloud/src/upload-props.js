export default {
  value: {
    type: [String, Array],
    default: () => ''
  },
  action: {
    type: String,
    default: () => ''
  },
  autoUpload: {
    type: Boolean,
    default: () => true
  },
  drag: {
    type: Boolean,
    default: () => true
  },
  disabled: {
    type: Boolean,
    default: () => false
  },
  headers: {
    type: Object
  },
  multiple: {
    type: Boolean,
    default: () => false
  },
  limit: {
    type: Number,
    default: () => 1
  },
  beforeUpload: {
    type: Function
  },
  beforeRemove: {
    type: Function
  },
  httpRequest: {
    type: Function
  },
  showFileList: {
    type: Boolean,
    default: () => true
  },
  data: {
    type: Object
  },
  name: {
    type: String,
    default: () => 'file'
  },
  withCredentials: {
    type: Boolean,
    default: () => false
  },
  accept: {
    // 接收上传文件类型
    type: String
  },
  listType: {
    type: String
  },
  size: {
    // 单个文件上传大小限制，单位M
    type: Number,
    default: () => 5
  },
  mode: {
    // 文件列表显示模式，preview
    type: String,
    default: () => ''
  },
  fileType: {
    // 明确的文件类型
    type: String,
    default: () => 'image'
  },
  preview: {
    // 开启预览
    type: Boolean,
    default: () => true
  },
  removable: {
    // 开启删除
    type: Boolean,
    default: () => true
  },
  download: {
    // 开启下载
    type: Boolean,
    default: () => false
  },
  errorTip: {
    type: Boolean,
    default: () => true
  }
}
// Details to https://element.eleme.cn/#/zh-CN/component/upload#attribute