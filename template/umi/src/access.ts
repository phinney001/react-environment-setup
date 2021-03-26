import { history } from 'umi'
import { getArray, session } from 'phinney-toolkit'

/**
 * 用户信息
 * @param access_token 用户token
 * @param username 用户名
 * @param roles 角色权限列表
 */
export interface UserInfo {
  access_token?: string
  username?: string
  roles?: string[]
}

// 登录地址
export const loginPath = '/passport/login'
// 登录后跳转地址
export const redirectPath = '/kanban'

// 获取登录后跳转地址
export function getRedirectPath() {
  const roles = getRoles()
  if (roles.includes('admin')) {
    return '/kanban'
  }
  return redirectPath
}

// 设置用户信息
export function setUserInfo(currentUser: UserInfo) {
  session.set('userinfo', currentUser)
}

// 获取用户信息
export function getUserInfo() {
  return session.get('userinfo')
}

// 获取用户名
export function getUserName() {
  return getUserInfo()?.username
}

// 跳转登录页
export function toLogin() {
  // 清除缓存
  session.clear()
  history.push(loginPath)
}

// 获取用户token
export function getToken(isOrigin?: boolean) {
  const token = getUserInfo()?.access_token
  return isOrigin ? token : token && `Bearer ${token}`
}

// 是否已经登录
export function isLogin() {
  return !!getToken()
}

// 获取角色权限
export function getRoles() {
  return getArray(getUserInfo()?.roles)
}

// 设置菜单
export function setMenus(menus: any) {
  return session.set('menus', menus)
}

// 获取菜单
export function getMenus() {
  return getArray(session.get('menus'))
}

// 是否是admin
export function isAdmin() {
  return true
  // return Boolean(getRoles()?.includes('admin'))
}

// 路由权限验证
export default function (initialState: any = {}) {
  return {
    isAdmin: () => initialState?.isAdmin,
  }
}
