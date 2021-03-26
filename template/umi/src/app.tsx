import { getUserName, isAdmin } from './access'
import getUserLayout from './layouts/UserLayout'

// 公共请求
export const request = import('@/utils/request')

// 初始状态获取
export async function getInitialState() {
  return {
    username: getUserName(),
    isAdmin: isAdmin(),
  }
}

// 登录后公共布局
export const layout = () => getUserLayout()
