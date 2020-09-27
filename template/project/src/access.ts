import { stringify } from 'qs'
import { history } from 'umi'
import { session } from './services/storage'

// 登录地址
export const loginPath = '/passport/login'
// 登录后跳转地址
export const redirectPath = '/home'

// 设置用户token
export function setToken(token: string) {
  session.set('access_token', token)
}

// 获取用户token
export function getToken(isOrigin?: boolean) {
  const token = session.get('access_token')
  return isOrigin ? token : (token && `Bearer ${token}`)
}

// 设置用户信息
export function setUserInfo(currentUser: API.CurrentUser) {
  session.set('userinfo', currentUser)
  session.set('username', currentUser.username)
}

// 获取用户信息
export function getUserInfo() {
  return session.get('userinfo')
}

// 设置菜单信息
export function setMenus(menus: any) {
  session.set('menus', menus)
}

// 获取菜单信息
export function getMenus() {
  return session.get('menus')
}

// 获取用户名
export function getUserName() {
  return session.get('username')
}

// 跳转登录页
export function toLogin() {
  // 清除缓存
  session.clear()
  history.replace({
    pathname: loginPath,
    search: stringify({
      redirect: window.location.href,
    }),
  })
}

// 是否有权限
export default function access() {
  return !!getToken()
}
