/**
 * request 网络请求工具
 * 更详细的 api 文档: https://github.com/umijs/umi-request
 */
import { extend, ResponseError } from 'umi-request'
import { notification, message } from 'antd'
import moment from 'moment'
import { getToken, toLogin } from '@/access'

const codeMessage = {
  200: '服务器成功返回请求的数据。',
  201: '新建或修改数据成功。',
  202: '一个请求已经进入后台排队（异步任务）。',
  204: '删除数据成功。',
  400: '发出的请求有错误，服务器没有进行新建或修改数据的操作。',
  401: '用户没有权限（令牌、用户名、密码错误）。',
  403: '用户得到授权，但是访问是被禁止的。',
  404: '发出的请求针对的是不存在的记录，服务器没有进行操作。',
  406: '请求的格式不可得。',
  410: '请求的资源被永久删除，且不会再得到的。',
  422: '当创建一个对象时，发生一个验证错误。',
  500: '服务器发生错误，请检查服务器。',
  502: '网关错误。',
  503: '服务不可用，服务器暂时过载或维护。',
  504: '网关超时。',
}

/**
 * 异常处理程序
 */
const errorHandler = (error: ResponseError) => {
  const { response = {} as Response } = error
  if (response?.status) {
    const errortext = codeMessage[response.status] || response.statusText
    const { status, url } = response

    notification.error({
      message: `请求错误 ${status}: ${url}`,
      description: errortext,
    })
  } else {
    notification.error({
      description: '您的网络发生异常，无法连接服务器',
      message: '网络异常',
    })
  }
  return response
}

/**
 * 配置request请求时的默认参数
 */
const request: any = extend({
  errorHandler, // 默认错误处理
  credentials: 'include', // 默认请求是否带上cookie
})

// 请求url前缀
request.baseUrl = '/api'

request.interceptors.request.use((url: string, options: any) => {
  // moment日期少一天解决
  moment.fn.toISOString = function () {
    return this.format('YYYY-MM-DDTHH:mm:ss.SSS[Z]')
  }

  return {
    url: request.baseUrl + url,
    options: {
      ...options,
      interceptors: true,
      headers: {
        Authorization: getToken(),
      },
    },
  }
})

// 错误信息列表
request.messageList = []
/**
 * 处理错误信息
 * @param msg 错误信息
 */
request.dealMsg = function (msg: string) {
  request.messageList.push(msg)
  request.messageList = [...new Set(request.messageList)]
  if (request.messageTimer) {
    clearInterval(request.messageTimer)
  }
  request.messageTimer = setInterval(() => {
    while (request.messageList.length) {
      message.error(request.messageList[0])
      request.messageList.shift()
    }
  }, 100)
}

/**
 * 下载文件
 * @param blobData 文件数据
 * @param filename 文件名称
 */
request.download = function (blobData: any, filename?: string) {
  const objectUrl = URL.createObjectURL(blobData)
  const a = document.createElement('a')
  document.body.appendChild(a)
  a.setAttribute('style', 'display:none')
  a.setAttribute('href', objectUrl)
  a.setAttribute('download', filename || blobData.filename)
  a.click()
  document.body.removeChild(a)
  // 释放URL地址
  URL.revokeObjectURL(objectUrl)
}

request.interceptors.response.use(async (response: any) => {
  // 是否是文件
  const isFile: any = response.headers.get('content-disposition')
  const res: any = await (isFile ? response.clone().blob() : response.clone().json())

  // 如果是文件则自动下载
  if (isFile) {
    res.filename = decodeURI(isFile.split('filename=').pop())
    request.download(res)
    return res
  }
  // 登录失效
  if (res?.httpStatus === 401) {
    toLogin()
    return false
  }
  // 请求失败
  if (res?.httpStatus && res?.httpStatus !== 200) {
    request.dealMsg(res.msg)
  }
  // 请求成功
  if (res?.httpStatus === 200) {
    return Reflect.has(res, 'data') ? res.data || true : res
  }
  return false
})

export default request
