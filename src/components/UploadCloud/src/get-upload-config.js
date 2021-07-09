/* eslint-disable */
import { getOssToken } from '@/api/user'
import { genPolicySignature, uuid } from './oss-upload-config'
let uploadOption
let refreshTime = 0
export {
  uuid
}
/**
 * maxSize: 文件大小，单位兆(M)，默认100M
*/
export default async(maxSize) => {
  try {
    // if (uploadOption && getTwiceTimeGapValid()) return { ...uploadOption }
    const { data: { accessKeyId, accessKeySecret, securityToken, endPoint, bucketName, filePrefix, ossPrefix }} = await getOssToken()
    const { policy, signature } = genPolicySignature(accessKeySecret, maxSize)
    refreshTime = +new Date()
    uploadOption = {
      OSSAccessKeyId: accessKeyId,
      policy,
      signature,
      securityToken,
      endPoint,
      bucketName,
      filePrefix,
      ossPrefix
    }
    return { ...uploadOption }
  } catch (ex) {
    return Promise.reject(ex)
  }
}

function getTwiceTimeGapValid() {
  return (+new Date() - refreshTime) / 1000 <= 7 * 60 * 1000
}
