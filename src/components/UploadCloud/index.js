import UploadCloud from './src/main'
UploadCloud.install = function(Vue) {
  Vue.component(UploadCloud.name, UploadCloud)
}
export default UploadCloud