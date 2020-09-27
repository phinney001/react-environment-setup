import { history } from 'umi'
import { loginPath, setMenus, toLogin } from './access'
import getUserLayout from './layouts/UserLayout'
import { queryMenus } from './services/user'

// 公共请求
export const request = import('@/utils/request')

// 初始状态获取
export async function getInitialState() {
  // 如果是登录页面，不执行
  if (history.location.pathname !== loginPath) {
    try {
      const res = await queryMenus()
      setMenus(res?.menus)
    } catch (error) {
      toLogin()
    }
  }
  return {}
}

// 登录后公共布局
export const layout = () => getUserLayout()