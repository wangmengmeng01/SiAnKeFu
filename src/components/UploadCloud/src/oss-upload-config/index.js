/* eslint-disable */
import Base64 from './base64'
import { hmac, sha1, util as CryptoLocalUtil } from './crypto'
export { uuid, genPolicySignature, Base64 }
/**
 * 生成唯一字符串
 */
function uuid() {
  var d = new Date().getTime()
  return 'xxxxxxxxxxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    var r = (d + Math.random() * 16) % 16 | 0
    d = Math.floor(d / 16)
    return (c === 'x' ? r : (r & 0x3) | 0x8).toString(16)
  })
}
/**
 * accessKey ali oss存储的accessKeySecret
 * size 文件大小，单位兆(M)
 */
function genPolicySignature(accesskey, size) {
  size = parseFloat(size)
  size = (isNaN(size) ? 100 : size) * 1024 * 1024
  var policyJsonString = {
    // 设置该Policy的失效时间，超过这个失效时间之后，就没有办法通过这个policy上传文件了
    "expiration": (new Date(Date.now() + 1 * 24 * 3600 * 1000)).toISOString(),
    "conditions": [
      // 设置上传文件的大小限制
      ["content-length-range", 0, size]
    ]
  }
  var policy = Base64.encode(JSON.stringify(policyJsonString))
  var bytes = hmac(sha1, policy, accesskey, { asBytes: true })
  var signature = CryptoLocalUtil.bytesToBase64(bytes)
  return {
    policy: policy,
    signature: signature
  }
}
